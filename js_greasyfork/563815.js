// ==UserScript==
// @name         YouTube CleanFeed
// @name:fr      YouTube CleanFeed – Nettoyer YouTube
// @name:en      YouTube CleanFeed – Clean YouTube
// @name:de      YouTube CleanFeed – YouTube aufräumen
// @name:es      YouTube CleanFeed – Limpiar YouTube
// @name:it      YouTube CleanFeed – Pulire YouTube
// @name:pt      YouTube CleanFeed – Limpar YouTube
// @name:nl      YouTube CleanFeed – YouTube opschonen
// @name:pl      YouTube CleanFeed – Czyszczenie YouTube
// @name:tr      YouTube CleanFeed – YouTube temizleme
//
// @author       Raph563
// @namespace    yt-cleanfeed
// @version      6.3.0
//
// @description     Clean YouTube by hiding Shorts, News, and low-popularity videos.
// @description:fr  Nettoie YouTube en masquant Shorts, actualités et vidéos peu populaires.
// @description:en  Clean YouTube by hiding Shorts, News, and low-popularity videos.
// @description:de  Räumt YouTube auf, indem Shorts, News und Videos mit wenigen Aufrufen ausgeblendet werden.
// @description:es  Limpia YouTube ocultando Shorts, noticias y vídeos con pocas visualizaciones.
// @description:it  Pulisce YouTube nascondendo Shorts, notizie e video con poche visualizzazioni.
// @description:pt  Limpa o YouTube ocultando Shorts, notícias e vídeos com poucas visualizações.
// @description:nl  Schoont YouTube op door Shorts, nieuws en video’s met weinig weergaven te verbergen.
// @description:pl  Czyści YouTube, ukrywając Shorts, wiadomości i filmy z małą liczbą wyświetleń.
// @description:tr  Shorts, haberler ve az izlenen videoları gizleyerek YouTube’u temizler.
//
// @homepageURL  https://github.com/Raph563/-YouTube_CleanFeed_-_Remove_Low_Views_Videos
//
// @match        https://www.youtube.com/*
// @run-at       document-start
//
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/563815/YouTube%20CleanFeed.user.js
// @updateURL https://update.greasyfork.org/scripts/563815/YouTube%20CleanFeed.meta.js
// ==/UserScript==



(() => {
  "use strict";

  /* =========================================================
   * I18N
   * ========================================================= */
  const I18N = {
    fr: {
      sec_global: "Global",
      sec_home: "Accueil (Home)",
      sec_search: "Recherche",
      sec_watch: "Lecture (/watch)",
      sec_navui: "Navigation & Interface",
      sec_actions: "Actions",

      mode_label: "Mode",
      mode_perf: "Performance",
      mode_eco: "Économie",
      mode_ultra: "Ultra Éco",

      opt_shorts_home: "Masquer Shorts sur Accueil",
      opt_shorts_search: "Masquer Shorts dans la Recherche (étagère + résultats)",
      opt_news_home: "Masquer Actualités/News sur Accueil",
      opt_sidebar_shorts: "Masquer “Shorts” dans le menu latéral",
      opt_block_shorts_page: "Bloquer la page Shorts (rediriger vers Accueil)",

      opt_lowpop_home: "Filtrer vidéos peu populaires sur Accueil",
      opt_lowpop_watch: "Filtrer recommandations peu populaires sur /watch",
      opt_lowpop_search: "Filtrer vidéos peu populaires dans la recherche",

      opt_float_buttons: "Afficher le menu de boutons (Home + /watch)",
      opt_header_hover_watch: "Masquer le header hors survol (/watch)",

      dock_lowpop_min_label: "Seuil vues impopulaires",
      dock_lowpop_min_custom: "Personnaliser",
      dock_lowpop_min_prompt: "Entrer un seuil (ex: 1k, 1M, 1k3)",
      dock_lowpop_min_invalid: "Valeur invalide",

      act_apply: "↻ Appliquer maintenant",
      act_reset: "⟲ Réinitialiser tous les réglages",

      status_on: "ON",
      status_off: "OFF",

      dock_collapse: "Ranger ▼",
      dock_expand: "Paramètre ▲",
      dock_shorts_show: "Afficher Shorts",
      dock_shorts_hide: "Masquer Shorts",
      dock_lowpop_home_show: "Afficher les vidéos peu populaires",
      dock_lowpop_home_hide: "Masquer les vidéos peu populaires",
      dock_lowpop_watch_show: "Afficher les recommandations peu populaires",
      dock_lowpop_watch_hide: "Masquer les recommandations peu populaires",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",
      dock_header_state_on: "Header auto hide : ON",
      dock_header_state_off: "Header auto hide : OFF",
      dock_header_label: "Header auto hide",
      dock_header_action_on: "Toujours afficher le header",
      dock_header_action_off: "Activer le masquage auto",

      dock_shorts_state_on: "Filtre Shorts : ON",
      dock_shorts_state_off: "Filtre Shorts : OFF",
      dock_shorts_label: "Shorts masqués",
      dock_shorts_action_on: "Afficher les Shorts",
      dock_shorts_action_off: "Masquer les Shorts",
      dock_shorts_info: "Masque les étagères Shorts sur la page d’accueil.",

      dock_news_label: "News masquées",
      dock_news_action_on: "Afficher les News",
      dock_news_action_off: "Masquer les News",
      dock_news_info: "Masque la section Actualités/News sur la page d’accueil.",

      dock_shorts_search_label: "Shorts masqués (Recherche)",
      dock_shorts_search_action_on: "Afficher les Shorts (Recherche)",
      dock_shorts_search_action_off: "Masquer les Shorts (Recherche)",
      dock_shorts_search_info: "Supprime les étagères Shorts et les résultats Shorts dans la recherche.",

      dock_sidebar_shorts_label: "Shorts masqués (menu)",
      dock_sidebar_shorts_action_on: "Afficher “Shorts” (menu)",
      dock_sidebar_shorts_action_off: "Masquer “Shorts” (menu)",
      dock_sidebar_shorts_info: "Cache l’entrée Shorts dans le menu latéral.",

      dock_block_shorts_label: "Page Shorts bloquée",
      dock_block_shorts_action_on: "Débloquer la page Shorts",
      dock_block_shorts_action_off: "Bloquer la page Shorts",
      dock_block_shorts_info: "Redirige la page Shorts vers l’accueil.",

      dock_lowpop_home_state_on: "Filtre impopulaire (Accueil) : ON",
      dock_lowpop_home_state_off: "Filtre impopulaire (Accueil) : OFF",
      dock_lowpop_home_label: "Vidéos peu populaires (Accueil)",
      dock_lowpop_home_action_on: "Afficher les vidéos peu populaires",
      dock_lowpop_home_action_off: "Masquer les vidéos peu populaires",
      dock_lowpop_home_info: "Masque les vidéos sous le seuil de vues sur l’accueil.",

      dock_lowpop_watch_state_on: "Filtre impopulaire (/watch) : ON",
      dock_lowpop_watch_state_off: "Filtre impopulaire (/watch) : OFF",
      dock_lowpop_watch_label: "Vidéos peu populaires (/watch)",
      dock_lowpop_watch_action_on: "Afficher les recommandations peu populaires",
      dock_lowpop_watch_action_off: "Masquer les recommandations peu populaires",
      dock_lowpop_watch_info: "Masque les recommandations sous le seuil de vues sur /watch.",
      dock_autolike_subs_label: "Auto-like abonnements",
      dock_autolike_subs_action_on: "Desactiver auto-like",
      dock_autolike_subs_action_off: "Activer auto-like",
      dock_autolike_subs_info: "Like automatiquement les videos des chaines abonnees.",
      dock_autolike_blocklist_label: "Blocklist auto-like",
      dock_autolike_blocklist_action: "Reinitialiser la blocklist",
      dock_autolike_blocklist_info: "Efface la liste des videos bloquees (unlike/dislike manuel).",

      dock_lowpop_search_label: "Vidéos peu populaires (Recherche)",
      dock_lowpop_search_action_on: "Afficher les vidéos peu populaires (Recherche)",
      dock_lowpop_search_action_off: "Masquer les vidéos peu populaires (Recherche)",
      dock_lowpop_search_info: "Masque les vidéos sous le seuil de vues dans la recherche.",

      dock_lowlive_min_label: "Seuil viewers live",
      dock_lowlive_min_custom: "Personnaliser",
      dock_lowlive_min_prompt: "Entrer un seuil live (ex: 50, 1k)",
      dock_lowlive_min_invalid: "Valeur invalide",

      dock_live_home_label: "Livestreams masqués (Accueil)",
      dock_live_home_action_on: "Afficher les livestreams (Accueil)",
      dock_live_home_action_off: "Masquer les livestreams (Accueil)",
      dock_live_home_info: "Masque les livestreams sur la page d’accueil.",

      dock_live_watch_label: "Livestreams masqués (/watch)",
      dock_live_watch_action_on: "Afficher les livestreams (/watch)",
      dock_live_watch_action_off: "Masquer les livestreams (/watch)",
      dock_live_watch_info: "Masque les recommandations live sur /watch.",

      dock_live_search_label: "Livestreams masqués (Recherche)",
      dock_live_search_action_on: "Afficher les livestreams (Recherche)",
      dock_live_search_action_off: "Masquer les livestreams (Recherche)",
      dock_live_search_info: "Masque les livestreams dans la recherche.",

      dock_lowlive_home_label: "Livestreams peu populaires (Accueil)",
      dock_lowlive_home_action_on: "Afficher les livestreams peu populaires",
      dock_lowlive_home_action_off: "Masquer les livestreams peu populaires",
      dock_lowlive_home_info: "Masque les livestreams sous le seuil de viewers sur l’accueil.",

      dock_lowlive_watch_label: "Livestreams peu populaires (/watch)",
      dock_lowlive_watch_action_on: "Afficher les livestreams peu populaires",
      dock_lowlive_watch_action_off: "Masquer les livestreams peu populaires",
      dock_lowlive_watch_info: "Masque les livestreams sous le seuil de viewers sur /watch.",

      dock_lowlive_search_label: "Livestreams peu populaires (Recherche)",
      dock_lowlive_search_action_on: "Afficher les livestreams peu populaires",
      dock_lowlive_search_action_off: "Masquer les livestreams peu populaires",
      dock_lowlive_search_info: "Masque les livestreams sous le seuil de viewers dans la recherche.",

      dock_header_info: "Active le masquage auto du header sur /watch, avec apparition au survol.",
      dock_float_buttons_label: "Dock affiché",
      dock_float_buttons_action_on: "Masquer le dock",
      dock_float_buttons_action_off: "Afficher le dock",
      dock_float_buttons_info: "Affiche ou masque le dock de boutons flottants.",
      dock_menu_home_label: "Fonctionnalités Accueil",
      dock_menu_home_title: "Fonctionnalités Accueil :",
      dock_menu_home_info: "Réglages spécifiques à l'accueil (Shorts, News, vidéos peu populaires).",
      dock_menu_general_label: "Général",
      dock_menu_general_title: "Général :",
      dock_menu_general_info: "Raccourcis globaux (Shorts, Live, filtres, etc.).",
      dock_menu_watch_label: "Fonctionnalités Vidéo",
      dock_menu_watch_title: "Fonctionnalités Vidéo :",
      dock_menu_watch_info: "Réglages spécifiques à la page vidéo (/watch).",
      dock_menu_search_label: "Fonctionnalités Recherche",
      dock_menu_search_title: "Fonctionnalités Recherche :",
      dock_menu_search_info: "Options dédiées aux résultats et étagères de recherche.",
      dock_menu_sidebar_label: "Fonctionnalités Menu latéral",
      dock_menu_sidebar_title: "Fonctionnalités Menu latéral :",
      dock_menu_sidebar_info: "Paramètres dédiés à la barre latérale.",
      dock_menu_adv_label: "Avancé",
      dock_menu_adv_title: "Avancé :",
      dock_menu_adv_info: "Options avancées du dock (visibilité, etc.).",
      dock_menu_back: "Retour ◀️",

      dock_master_shorts_label: "Supprimer entièrement les Shorts",
      dock_master_shorts_action_on: "Tout afficher (Shorts)",
      dock_master_shorts_action_off: "Tout masquer (Shorts)",
      dock_master_shorts_info: "Active toutes les options liées aux Shorts (Accueil, Recherche, Menu, Blocage).",

      dock_master_lowpop_label: "Filtrer les vidéos peu populaires",
      dock_master_lowpop_action_on: "Afficher vidéos peu populaires",
      dock_master_lowpop_action_off: "Masquer vidéos peu populaires",
      dock_master_lowpop_info: "Active le filtre low-pop sur Accueil, Recherche et /watch.",

      dock_master_news_label: "Masquer News/Actualités",
      dock_master_news_action_on: "Afficher News",
      dock_master_news_action_off: "Masquer News",
      dock_master_news_info: "Masque la section News/Actualités sur l’accueil.",

      dock_master_live_label: "Masquer les livestreams",
      dock_master_live_action_on: "Afficher les livestreams",
      dock_master_live_action_off: "Masquer les livestreams",
      dock_master_live_info: "Active le masquage des livestreams sur Accueil, Recherche et /watch.",

      dock_master_lowlive_label: "Masquer les livestreams peu populaires",
      dock_master_lowlive_action_on: "Afficher les livestreams peu populaires",
      dock_master_lowlive_action_off: "Masquer les livestreams peu populaires",
      dock_master_lowlive_info: "Active le filtre live peu populaire sur Accueil, Recherche et /watch.",

      dock_master_header_label: "Header auto-hide (/watch)",
      dock_master_header_action_on: "Header normal",
      dock_master_header_action_off: "Header auto",
      dock_master_header_info: "Active ou désactive le masquage auto du header sur /watch.",

      dock_mode_state_perf: "Mode : Performance",
      dock_mode_state_eco: "Mode : Économie",
      dock_mode_label: "Mode éco",
      dock_mode_action_perf: "Passer en mode Économie",
      dock_mode_action_eco: "Passer en mode Performance",
      dock_mode_status_ultra: "Mode : Ultra Éco",
      dock_mode_status_eco: "Mode : Éco",
      dock_mode_status_perf: "Mode : Performance",
      dock_mode_change: "Changer mode",
      dock_mode_back: "Retour",
      dock_mode_select: "Sélectionner votre mode :",
      dock_mode_btn_ultra: "Ultra Éco",
      dock_mode_btn_eco: "Éco",
      dock_mode_btn_perf: "Performance",
      dock_mode_info_ultra: "Ultra Éco :\n- Désactive filtres impopulaires\n- Désactive auto-hide header\n- Animations minimales\n- Moins de scans automatiques",
      dock_mode_info_eco: "Éco :\n- Scans en idle\n- Animations réduites\n- Fonctions standard",
      dock_mode_info_perf: "Performance :\n- Observers en temps réel\n- Animations complètes\n- Toutes les fonctions",

      // ✅ CLÉ MANQUANTE AJOUTÉE
      dock_go_top: "Allez en haut de la page",
      dock_lang_label: "Langue",
      dock_lang_auto: "Auto",

      toast_updated: "Mise à jour",
      toast_reset: "Réglages réinitialisés",
      toast_mode_perf: "Mode : Performance",
      toast_mode_eco: "Mode : Économie de ressources",
      toast_mode_ultra: "Mode : Ultra Éco",
      toast_btn_home_on: "Filtre accueil : activé (bouton)",
      toast_btn_home_off: "Filtre accueil : désactivé (bouton)",
      toast_btn_watch_on: "Filtre /watch : activé (bouton)",
      toast_btn_watch_off: "Filtre /watch : désactivé (bouton)",

      toast_header_on: "Header auto : activé (/watch)",
      toast_header_off: "Header auto : désactivé (/watch)",
      toast_autolike_blocklist_reset: "Blocklist auto-like reinitialisee",
      toast_autolike_indicator_hint: "Auto-like actif. Cliquez pour retirer le like et bloquer l'auto-like pour cette vidéo.",
      toast_autolike_indicator_clicked: "Like retiré. Auto-like bloqué pour cette vidéo.",
      toast_autolike_indicator_failed: "Impossible de retirer le like pour le moment. Réessayez.",
    },

    en: {
      sec_global: "Global",
      sec_home: "Home",
      sec_search: "Search",
      sec_watch: "Watch (/watch)",
      sec_navui: "Navigation & UI",
      sec_actions: "Actions",

      mode_label: "Mode",
      mode_perf: "Performance",
      mode_eco: "Saver",
      mode_ultra: "Ultra Saver",

      opt_shorts_home: "Hide Shorts on Home",
      opt_shorts_search: "Hide Shorts in Search (shelf + results)",
      opt_news_home: "Hide News/Top stories on Home",
      opt_sidebar_shorts: 'Hide "Shorts" in sidebar',
      opt_block_shorts_page: "Block Shorts page (redirect to Home)",

      opt_lowpop_home: "Filter low-popularity videos on Home",
      opt_lowpop_watch: "Filter low-popularity recommendations on /watch",
      opt_lowpop_search: "Filter low-popularity videos in Search",

      opt_float_buttons: "Show button dock (Home + /watch)",
      opt_header_hover_watch: "Hide header when not hovered (/watch)",

      dock_lowpop_min_label: "Low-pop min views",
      dock_lowpop_min_custom: "Custom",
      dock_lowpop_min_prompt: "Enter a threshold (e.g. 1k, 1M, 1k3)",
      dock_lowpop_min_invalid: "Invalid value",

      act_apply: "↻ Apply now",
      act_reset: "⟲ Reset all settings",

      status_on: "ON",
      status_off: "OFF",

      dock_collapse: "Collapse ▼",
      dock_expand: "Settings ▲",
      dock_shorts_show: "Show Shorts",
      dock_shorts_hide: "Hide Shorts",
      dock_lowpop_home_show: "Show unpopular videos",
      dock_lowpop_home_hide: "Hide unpopular videos",
      dock_lowpop_watch_show: "Show unpopular recommendations",
      dock_lowpop_watch_hide: "Hide unpopular recommendations",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",
      dock_header_state_on: "Header auto-hide: ON",
      dock_header_state_off: "Header auto-hide: OFF",
      dock_header_label: "Header auto-hide",
      dock_header_action_on: "Keep the header always visible",
      dock_header_action_off: "Enable auto-hide",

      dock_shorts_state_on: "Shorts filter: ON",
      dock_shorts_state_off: "Shorts filter: OFF",
      dock_shorts_label: "Shorts hidden",
      dock_shorts_action_on: "Show Shorts",
      dock_shorts_action_off: "Hide Shorts",
      dock_shorts_info: "Hides Shorts shelves on the Home feed.",

      dock_news_label: "News hidden",
      dock_news_action_on: "Show News",
      dock_news_action_off: "Hide News",
      dock_news_info: "Hides the News/Top stories section on Home.",

      dock_shorts_search_label: "Shorts hidden (Search)",
      dock_shorts_search_action_on: "Show Shorts (Search)",
      dock_shorts_search_action_off: "Hide Shorts (Search)",
      dock_shorts_search_info: "Removes Shorts shelves and Shorts results in Search.",

      dock_sidebar_shorts_label: "Shorts hidden (menu)",
      dock_sidebar_shorts_action_on: "Show Shorts (menu)",
      dock_sidebar_shorts_action_off: "Hide Shorts (menu)",
      dock_sidebar_shorts_info: "Hides the Shorts entry in the sidebar.",

      dock_block_shorts_label: "Shorts page blocked",
      dock_block_shorts_action_on: "Unblock Shorts page",
      dock_block_shorts_action_off: "Block Shorts page",
      dock_block_shorts_info: "Redirects the Shorts page back to Home.",

      dock_lowpop_home_state_on: "Low-pop filter (Home): ON",
      dock_lowpop_home_state_off: "Low-pop filter (Home): OFF",
      dock_lowpop_home_label: "Low-pop videos (Home)",
      dock_lowpop_home_action_on: "Show unpopular videos",
      dock_lowpop_home_action_off: "Hide unpopular videos",
      dock_lowpop_home_info: "Hides videos under the view threshold on Home.",

      dock_lowpop_watch_state_on: "Low-pop filter (/watch): ON",
      dock_lowpop_watch_state_off: "Low-pop filter (/watch): OFF",
      dock_lowpop_watch_label: "Low-pop recs (/watch)",
      dock_lowpop_watch_action_on: "Show unpopular recommendations",
      dock_lowpop_watch_action_off: "Hide unpopular recommendations",
      dock_lowpop_watch_info: "Hides recommendations under the view threshold on /watch.",
      dock_autolike_subs_label: "Auto-like subscribed channels",
      dock_autolike_subs_action_on: "Disable auto-like",
      dock_autolike_subs_action_off: "Enable auto-like",
      dock_autolike_subs_info: "Automatically likes videos from channels you are subscribed to.",
      dock_autolike_blocklist_label: "Auto-like blocklist",
      dock_autolike_blocklist_action: "Reset blocklist",
      dock_autolike_blocklist_info: "Clears the list of videos you manually unliked/disliked.",

      dock_lowpop_search_label: "Low-pop videos (Search)",
      dock_lowpop_search_action_on: "Show unpopular videos (Search)",
      dock_lowpop_search_action_off: "Hide unpopular videos (Search)",
      dock_lowpop_search_info: "Hides videos under the view threshold in Search.",

      dock_lowlive_min_label: "Live min viewers",
      dock_lowlive_min_custom: "Custom",
      dock_lowlive_min_prompt: "Enter a live threshold (e.g. 50, 1k)",
      dock_lowlive_min_invalid: "Invalid value",

      dock_live_home_label: "Livestreams hidden (Home)",
      dock_live_home_action_on: "Show livestreams (Home)",
      dock_live_home_action_off: "Hide livestreams (Home)",
      dock_live_home_info: "Hides live streams on the Home feed.",

      dock_live_watch_label: "Livestreams hidden (/watch)",
      dock_live_watch_action_on: "Show livestreams (/watch)",
      dock_live_watch_action_off: "Hide livestreams (/watch)",
      dock_live_watch_info: "Hides live recommendations on /watch.",

      dock_live_search_label: "Livestreams hidden (Search)",
      dock_live_search_action_on: "Show livestreams (Search)",
      dock_live_search_action_off: "Hide livestreams (Search)",
      dock_live_search_info: "Hides live streams in Search.",

      dock_lowlive_home_label: "Low-viewer livestreams (Home)",
      dock_lowlive_home_action_on: "Show low-viewer livestreams",
      dock_lowlive_home_action_off: "Hide low-viewer livestreams",
      dock_lowlive_home_info: "Hides live streams under the viewer threshold on Home.",

      dock_lowlive_watch_label: "Low-viewer livestreams (/watch)",
      dock_lowlive_watch_action_on: "Show low-viewer livestreams",
      dock_lowlive_watch_action_off: "Hide low-viewer livestreams",
      dock_lowlive_watch_info: "Hides live streams under the viewer threshold on /watch.",

      dock_lowlive_search_label: "Low-viewer livestreams (Search)",
      dock_lowlive_search_action_on: "Show low-viewer livestreams",
      dock_lowlive_search_action_off: "Hide low-viewer livestreams",
      dock_lowlive_search_info: "Hides live streams under the viewer threshold in Search.",

      dock_header_info: "Enables auto-hide for the header on /watch, with reveal on hover.",
      dock_float_buttons_label: "Dock visible",
      dock_float_buttons_action_on: "Hide the dock",
      dock_float_buttons_action_off: "Show the dock",
      dock_float_buttons_info: "Shows or hides the floating button dock.",
      dock_menu_home_label: "Home Features",
      dock_menu_home_title: "Home Features:",
      dock_menu_home_info: "Home-specific settings (Shorts, News, low-pop videos).",
      dock_menu_general_label: "General",
      dock_menu_general_title: "General:",
      dock_menu_general_info: "Global shortcuts (Shorts, Live, filters, etc.).",
      dock_menu_watch_label: "Video Features",
      dock_menu_watch_title: "Video Features:",
      dock_menu_watch_info: "Video page settings (/watch).",
      dock_menu_search_label: "Search Features",
      dock_menu_search_title: "Search Features:",
      dock_menu_search_info: "Search-specific filters and shelves.",
      dock_menu_sidebar_label: "Sidebar Features",
      dock_menu_sidebar_title: "Sidebar Features:",
      dock_menu_sidebar_info: "Sidebar entry visibility choices.",
      dock_menu_adv_label: "Advanced",
      dock_menu_adv_title: "Advanced:",
      dock_menu_adv_info: "Advanced dock options (visibility, etc.).",
      dock_menu_back: "Back ◀️",

      dock_master_shorts_label: "Remove Shorts entirely",
      dock_master_shorts_action_on: "Show all Shorts",
      dock_master_shorts_action_off: "Hide all Shorts",
      dock_master_shorts_info: "Enables all Shorts-related options (Home, Search, Sidebar, Block page).",

      dock_master_lowpop_label: "Filter low-pop videos",
      dock_master_lowpop_action_on: "Show low-pop videos",
      dock_master_lowpop_action_off: "Hide low-pop videos",
      dock_master_lowpop_info: "Enables low-pop filter on Home, Search and /watch.",

      dock_master_news_label: "Hide News",
      dock_master_news_action_on: "Show News",
      dock_master_news_action_off: "Hide News",
      dock_master_news_info: "Hides the News/Top stories section on Home.",

      dock_master_live_label: "Hide livestreams",
      dock_master_live_action_on: "Show livestreams",
      dock_master_live_action_off: "Hide livestreams",
      dock_master_live_info: "Enables live hiding on Home, Search and /watch.",

      dock_master_lowlive_label: "Hide low-viewer livestreams",
      dock_master_lowlive_action_on: "Show low-viewer livestreams",
      dock_master_lowlive_action_off: "Hide low-viewer livestreams",
      dock_master_lowlive_info: "Enables low-live filter on Home, Search and /watch.",

      dock_master_header_label: "Header auto-hide (/watch)",
      dock_master_header_action_on: "Header normal",
      dock_master_header_action_off: "Header auto",
      dock_master_header_info: "Enables/disables auto-hide header on /watch.",

      dock_mode_state_perf: "Mode: Performance",
      dock_mode_state_eco: "Mode: Saver",
      dock_mode_label: "Eco mode",
      dock_mode_action_perf: "Switch to Saver mode",
      dock_mode_action_eco: "Switch to Performance mode",
      dock_mode_status_ultra: "Mode: Ultra Saver",
      dock_mode_status_eco: "Mode: Saver",
      dock_mode_status_perf: "Mode: Performance",
      dock_mode_change: "Change mode",
      dock_mode_back: "Back",
      dock_mode_select: "Select your mode:",
      dock_mode_btn_ultra: "Ultra Saver",
      dock_mode_btn_eco: "Saver",
      dock_mode_btn_perf: "Performance",
      dock_mode_info_ultra: "Ultra Saver:\n- Disables low-pop filters\n- Disables header auto-hide\n- Minimal animations\n- Fewer automatic scans",
      dock_mode_info_eco: "Saver:\n- Idle-time scans\n- Reduced animations\n- Standard features",
      dock_mode_info_perf: "Performance:\n- Real-time observers\n- Full animations\n- All features",

      // ✅ CLÉ MANQUANTE AJOUTÉE
      dock_go_top: "Go to the top of the page",
      dock_lang_label: "Language",
      dock_lang_auto: "Auto",

      toast_updated: "Updated",
      toast_reset: "Settings reset",
      toast_mode_perf: "Mode: Performance",
      toast_mode_eco: "Mode: Resource Saver",
      toast_mode_ultra: "Mode: Ultra Saver",
      toast_btn_home_on: "Home filter: ON (button)",
      toast_btn_home_off: "Home filter: OFF (button)",
      toast_btn_watch_on: "Watch filter: ON (button)",
      toast_btn_watch_off: "Watch filter: OFF (button)",

      toast_header_on: "Header auto: ON (/watch)",
      toast_header_off: "Header auto: OFF (/watch)",
      toast_autolike_blocklist_reset: "Auto-like blocklist reset",
      toast_autolike_indicator_hint: "Auto-like active. Click to remove the like and block auto-like for this video.",
      toast_autolike_indicator_clicked: "Like removed. Auto-like blocked for this video.",
      toast_autolike_indicator_failed: "Unable to remove the like right now. Please try again.",
    },

    de: {
      sec_global: "Global",
      sec_home: "Startseite (Home)",
      sec_search: "Suche",
      sec_watch: "Wiedergabe (/watch)",
      sec_navui: "Navigation & UI",
      sec_actions: "Aktionen",

      mode_label: "Modus",
      mode_perf: "Leistung",
      mode_eco: "Sparen",
      mode_ultra: "Ultra Sparen",

      opt_shorts_home: "Shorts auf Startseite ausblenden",
      opt_shorts_search: "Shorts in Suche ausblenden (Regal + Ergebnisse)",
      opt_news_home: "News/Top-Meldungen auf Startseite ausblenden",
      opt_sidebar_shorts: '"Shorts" in Seitenleiste ausblenden',
      opt_block_shorts_page: "Shorts-Seite blockieren (zur Startseite umleiten)",

      opt_lowpop_home: "Unbeliebte Videos auf Startseite filtern",
      opt_lowpop_watch: "Unbeliebte Empfehlungen auf /watch filtern",
      opt_lowpop_search: "Unbeliebte Videos in der Suche filtern",

      opt_float_buttons: "Button-Dock anzeigen (Home + /watch)",
      opt_header_hover_watch: "Header ausblenden, wenn nicht gehovert (/watch)",

      act_apply: "↻ Jetzt anwenden",
      act_reset: "⟲ Einstellungen zurücksetzen",

      status_on: "EIN",
      status_off: "AUS",

      dock_collapse: "Einklappen ▼",
      dock_expand: "Einstellungen ▲",
      dock_shorts_show: "Shorts anzeigen",
      dock_shorts_hide: "Shorts ausblenden",
      dock_lowpop_home_show: "Unbeliebte Videos anzeigen",
      dock_lowpop_home_hide: "Unbeliebte Videos ausblenden",
      dock_lowpop_watch_show: "Unbeliebte Empfehlungen anzeigen",
      dock_lowpop_watch_hide: "Unbeliebte Empfehlungen ausblenden",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",
      dock_header_state_on: "Header Auto-Hide: EIN",
      dock_header_state_off: "Header Auto-Hide: AUS",
      dock_header_label: "Header Auto-Ausblenden",
      dock_header_action_on: "Header immer anzeigen",
      dock_header_action_off: "Auto-Ausblenden aktivieren",

      dock_shorts_state_on: "Shorts-Filter: EIN",
      dock_shorts_state_off: "Shorts-Filter: AUS",
      dock_shorts_label: "Shorts ausgeblendet",
      dock_shorts_action_on: "Shorts anzeigen",
      dock_shorts_action_off: "Shorts ausblenden",
      dock_shorts_info: "Blendet Shorts-Regale auf der Startseite aus.",

      dock_news_label: "News ausgeblendet",
      dock_news_action_on: "News anzeigen",
      dock_news_action_off: "News ausblenden",
      dock_news_info: "Blendet News/Top-Meldungen auf der Startseite aus.",

      dock_shorts_search_label: "Shorts ausgeblendet (Suche)",
      dock_shorts_search_action_on: "Shorts anzeigen (Suche)",
      dock_shorts_search_action_off: "Shorts ausblenden (Suche)",
      dock_shorts_search_info: "Entfernt Shorts-Regale und Shorts-Ergebnisse in der Suche.",

      dock_sidebar_shorts_label: "Shorts ausgeblendet (Menü)",
      dock_sidebar_shorts_action_on: "Shorts anzeigen (Menü)",
      dock_sidebar_shorts_action_off: "Shorts ausblenden (Menü)",
      dock_sidebar_shorts_info: "Blendet den Shorts-Eintrag in der Seitenleiste aus.",

      dock_block_shorts_label: "Shorts-Seite blockiert",
      dock_block_shorts_action_on: "Shorts-Seite freigeben",
      dock_block_shorts_action_off: "Shorts-Seite blockieren",
      dock_block_shorts_info: "Leitet die Shorts-Seite zur Startseite um.",

      dock_lowpop_home_state_on: "Unbeliebt-Filter (Home): EIN",
      dock_lowpop_home_state_off: "Unbeliebt-Filter (Home): AUS",
      dock_lowpop_home_label: "Unbeliebte Videos (Home)",
      dock_lowpop_home_action_on: "Unbeliebte Videos anzeigen",
      dock_lowpop_home_action_off: "Unbeliebte Videos ausblenden",
      dock_lowpop_home_info: "Blendet Videos unter dem Aufruf-Schwellenwert auf Home aus.",

      dock_lowpop_watch_state_on: "Unbeliebt-Filter (/watch): EIN",
      dock_lowpop_watch_state_off: "Unbeliebt-Filter (/watch): AUS",
      dock_lowpop_watch_label: "Unbeliebte Empfehlungen (/watch)",
      dock_lowpop_watch_action_on: "Unbeliebte Empfehlungen anzeigen",
      dock_lowpop_watch_action_off: "Unbeliebte Empfehlungen ausblenden",
      dock_lowpop_watch_info: "Blendet Empfehlungen unter dem Aufruf-Schwellenwert auf /watch aus.",
      dock_autolike_subs_label: "Auto-like abonnierte Kanale",
      dock_autolike_subs_action_on: "Auto-like deaktivieren",
      dock_autolike_subs_action_off: "Auto-like aktivieren",
      dock_autolike_subs_info: "Liked automatisch Videos von abonnierten Kanalen.",

      dock_lowpop_search_label: "Unbeliebte Videos (Suche)",
      dock_lowpop_search_action_on: "Unbeliebte Videos anzeigen (Suche)",
      dock_lowpop_search_action_off: "Unbeliebte Videos ausblenden (Suche)",
      dock_lowpop_search_info: "Blendet Videos unter dem Aufruf-Schwellenwert in der Suche aus.",

      dock_lowlive_min_label: "Live-Min.-Zuschauer",
      dock_lowlive_min_custom: "Anpassen",
      dock_lowlive_min_prompt: "Live-Schwelle eingeben (z. B. 50, 1k)",
      dock_lowlive_min_invalid: "Ungültiger Wert",

      dock_live_home_label: "Livestreams ausgeblendet (Home)",
      dock_live_home_action_on: "Livestreams anzeigen (Home)",
      dock_live_home_action_off: "Livestreams ausblenden (Home)",
      dock_live_home_info: "Blendet Livestreams auf der Home-Seite aus.",

      dock_live_watch_label: "Livestreams ausgeblendet (/watch)",
      dock_live_watch_action_on: "Livestreams anzeigen (/watch)",
      dock_live_watch_action_off: "Livestreams ausblenden (/watch)",
      dock_live_watch_info: "Blendet Live-Empfehlungen auf /watch aus.",

      dock_live_search_label: "Livestreams ausgeblendet (Suche)",
      dock_live_search_action_on: "Livestreams anzeigen (Suche)",
      dock_live_search_action_off: "Livestreams ausblenden (Suche)",
      dock_live_search_info: "Blendet Livestreams in der Suche aus.",

      dock_lowlive_home_label: "Livestreams mit wenigen Zuschauern (Home)",
      dock_lowlive_home_action_on: "Livestreams mit wenigen Zuschauern anzeigen",
      dock_lowlive_home_action_off: "Livestreams mit wenigen Zuschauern ausblenden",
      dock_lowlive_home_info: "Blendet Livestreams unter dem Zuschauer-Schwellenwert auf Home aus.",

      dock_lowlive_watch_label: "Livestreams mit wenigen Zuschauern (/watch)",
      dock_lowlive_watch_action_on: "Livestreams mit wenigen Zuschauern anzeigen",
      dock_lowlive_watch_action_off: "Livestreams mit wenigen Zuschauern ausblenden",
      dock_lowlive_watch_info: "Blendet Livestreams unter dem Zuschauer-Schwellenwert auf /watch aus.",

      dock_lowlive_search_label: "Livestreams mit wenigen Zuschauern (Suche)",
      dock_lowlive_search_action_on: "Livestreams mit wenigen Zuschauern anzeigen",
      dock_lowlive_search_action_off: "Livestreams mit wenigen Zuschauern ausblenden",
      dock_lowlive_search_info: "Blendet Livestreams unter dem Zuschauer-Schwellenwert in der Suche aus.",

      dock_header_info: "Aktiviert Auto-Hide für den Header auf /watch, mit Anzeige bei Hover.",
      dock_float_buttons_label: "Dock sichtbar",
      dock_float_buttons_action_on: "Dock ausblenden",
      dock_float_buttons_action_off: "Dock anzeigen",
      dock_float_buttons_info: "Zeigt oder versteckt das schwebende Dock.",
      dock_menu_home_label: "Startseiten-Funktionen",
      dock_menu_home_title: "Startseiten-Funktionen:",
      dock_menu_home_info: "Startseiten-spezifische Einstellungen (Shorts, News, unbeliebte Videos).",
      dock_menu_general_label: "Allgemein",
      dock_menu_general_title: "Allgemein:",
      dock_menu_general_info: "Globale Kurzbefehle (Shorts, Live, Filter usw.).",
      dock_menu_watch_label: "Video-Funktionen",
      dock_menu_watch_title: "Video-Funktionen:",
      dock_menu_watch_info: "Einstellungen für die Videoseite (/watch).",
      dock_menu_search_label: "Suche-Funktionen",
      dock_menu_search_title: "Suche-Funktionen:",
      dock_menu_search_info: "Such-spezifische Optionen für Regale und Ergebnisse.",
      dock_menu_sidebar_label: "Seitenleisten-Funktionen",
      dock_menu_sidebar_title: "Seitenleisten-Funktionen:",
      dock_menu_sidebar_info: "Einstellungen für Einträge im Seitenmenü.",
      dock_menu_adv_label: "Erweitert",
      dock_menu_adv_title: "Erweitert:",
      dock_menu_adv_info: "Erweiterte Dock-Optionen (Sichtbarkeit, etc.).",
      dock_menu_back: "Zurück ◀️",

      dock_master_shorts_label: "Shorts vollständig entfernen",
      dock_master_shorts_action_on: "Alle Shorts anzeigen",
      dock_master_shorts_action_off: "Alle Shorts ausblenden",
      dock_master_shorts_info: "Aktiviert alle Shorts-bezogenen Optionen (Home, Suche, Seitenleiste, Seite blockieren).",

      dock_master_lowpop_label: "Unbeliebte Videos filtern",
      dock_master_lowpop_action_on: "Unbeliebte Videos anzeigen",
      dock_master_lowpop_action_off: "Unbeliebte Videos ausblenden",
      dock_master_lowpop_info: "Aktiviert den Low-pop-Filter auf Home, Suche und /watch.",

      dock_master_news_label: "News ausblenden",
      dock_master_news_action_on: "News anzeigen",
      dock_master_news_action_off: "News ausblenden",
      dock_master_news_info: "Blendet die News/Top-Meldungen-Sektion auf Home aus.",

      dock_master_live_label: "Livestreams ausblenden",
      dock_master_live_action_on: "Livestreams anzeigen",
      dock_master_live_action_off: "Livestreams ausblenden",
      dock_master_live_info: "Aktiviert das Ausblenden von Livestreams auf Home, Suche und /watch.",

      dock_master_lowlive_label: "Livestreams mit wenigen Zuschauern ausblenden",
      dock_master_lowlive_action_on: "Livestreams mit wenigen Zuschauern anzeigen",
      dock_master_lowlive_action_off: "Livestreams mit wenigen Zuschauern ausblenden",
      dock_master_lowlive_info: "Aktiviert den Low-live-Filter auf Home, Suche und /watch.",

      dock_master_header_label: "Header Auto-Hide (/watch)",
      dock_master_header_action_on: "Header normal",
      dock_master_header_action_off: "Header auto",
      dock_master_header_info: "Aktiviert oder deaktiviert das automatische Ausblenden des Headers auf /watch.",

      dock_mode_state_perf: "Modus: Leistung",
      dock_mode_state_eco: "Modus: Sparen",
      dock_mode_label: "Sparmodus",
      dock_mode_action_perf: "In Sparmodus wechseln",
      dock_mode_action_eco: "In Leistungsmodus wechseln",
      dock_mode_status_ultra: "Modus: Ultra Sparen",
      dock_mode_status_eco: "Modus: Sparen",
      dock_mode_status_perf: "Modus: Leistung",
      dock_mode_change: "Modus ändern",
      dock_mode_back: "Zurück",
      dock_mode_select: "Modus auswählen:",
      dock_mode_btn_ultra: "Ultra Sparen",
      dock_mode_btn_eco: "Sparen",
      dock_mode_btn_perf: "Leistung",
      dock_mode_info_ultra: "Ultra Sparen:\n- Unbeliebt-Filter aus\n- Header Auto-Hide aus\n- Minimale Animationen\n- Weniger automatische Scans",
      dock_mode_info_eco: "Sparen:\n- Scans im Leerlauf\n- Reduzierte Animationen\n- Standardfunktionen",
      dock_mode_info_perf: "Leistung:\n- Echtzeit-Observer\n- Volle Animationen\n- Alle Funktionen",

      // ✅ CLÉ MANQUANTE AJOUTÉE
      dock_go_top: "Zur Seitenoberkante",
      dock_lang_label: "Sprache",
      dock_lang_auto: "Auto",

      toast_updated: "Aktualisiert",
      toast_reset: "Einstellungen zurückgesetzt",
      toast_mode_perf: "Modus: Leistung",
      toast_mode_eco: "Modus: Ressourcen sparen",
      toast_mode_ultra: "Modus: Ultra Sparen",
      toast_btn_home_on: "Startseitenfilter: EIN (Button)",
      toast_btn_home_off: "Startseitenfilter: AUS (Button)",
      toast_btn_watch_on: "Watch-Filter: EIN (Button)",
      toast_btn_watch_off: "Watch-Filter: AUS (Button)",

      toast_header_on: "Header auto: EIN (/watch)",
      toast_header_off: "Header auto: AUS (/watch)",
    },

    es: {
      sec_global: "Global",
      sec_home: "Inicio (Home)",
      sec_search: "Búsqueda",
      sec_watch: "Reproducción (/watch)",
      sec_navui: "Navegación e IU",
      sec_actions: "Acciones",

      mode_label: "Modo",
      mode_perf: "Rendimiento",
      mode_eco: "Ahorro",
      mode_ultra: "Ultra Ahorro",

      opt_shorts_home: "Ocultar Shorts en Inicio",
      opt_shorts_search: "Ocultar Shorts en Búsqueda (estante + resultados)",
      opt_news_home: "Ocultar Noticias en Inicio",
      opt_sidebar_shorts: 'Ocultar “Shorts” en el menú lateral',
      opt_block_shorts_page: "Bloquear página de Shorts (redirigir a Inicio)",

      opt_lowpop_home: "Filtrar videos poco populares en Inicio",
      opt_lowpop_watch: "Filtrar recomendaciones poco populares en /watch",
      opt_lowpop_search: "Filtrar videos poco populares en Búsqueda",

      opt_float_buttons: "Mostrar dock de botones (Home + /watch)",
      opt_header_hover_watch: "Ocultar header si no hay hover (/watch)",

      act_apply: "↻ Aplicar ahora",
      act_reset: "⟲ Restablecer ajustes",

      status_on: "ON",
      status_off: "OFF",

      dock_collapse: "Colapsar ▼",
      dock_expand: "Ajustes ▲",
      dock_shorts_show: "Mostrar Shorts",
      dock_shorts_hide: "Ocultar Shorts",
      dock_lowpop_home_show: "Mostrar videos poco populares",
      dock_lowpop_home_hide: "Ocultar videos poco populares",
      dock_lowpop_watch_show: "Mostrar recomendaciones poco populares",
      dock_lowpop_watch_hide: "Ocultar recomendaciones poco populares",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",
      dock_header_state_on: "Auto-ocultar header: ON",
      dock_header_state_off: "Auto-ocultar header: OFF",
      dock_header_label: "Auto-ocultar header",
      dock_header_action_on: "Mostrar header siempre",
      dock_header_action_off: "Activar auto-ocultado",

      dock_shorts_state_on: "Filtro Shorts: ON",
      dock_shorts_state_off: "Filtro Shorts: OFF",
      dock_shorts_label: "Shorts ocultos",
      dock_shorts_action_on: "Mostrar Shorts",
      dock_shorts_action_off: "Ocultar Shorts",
      dock_shorts_info: "Oculta los estantes de Shorts en la página de inicio.",

      dock_news_label: "Noticias ocultas",
      dock_news_action_on: "Mostrar Noticias",
      dock_news_action_off: "Ocultar Noticias",
      dock_news_info: "Oculta la sección de Noticias/Top stories en Inicio.",

      dock_shorts_search_label: "Shorts ocultos (Búsqueda)",
      dock_shorts_search_action_on: "Mostrar Shorts (Búsqueda)",
      dock_shorts_search_action_off: "Ocultar Shorts (Búsqueda)",
      dock_shorts_search_info: "Quita estantes de Shorts y resultados de Shorts en la búsqueda.",

      dock_sidebar_shorts_label: "Shorts ocultos (menú)",
      dock_sidebar_shorts_action_on: "Mostrar Shorts (menú)",
      dock_sidebar_shorts_action_off: "Ocultar Shorts (menú)",
      dock_sidebar_shorts_info: "Oculta la entrada de Shorts en el menú lateral.",

      dock_block_shorts_label: "Página Shorts bloqueada",
      dock_block_shorts_action_on: "Desbloquear página Shorts",
      dock_block_shorts_action_off: "Bloquear página Shorts",
      dock_block_shorts_info: "Redirige la página Shorts a Inicio.",

      dock_lowpop_home_state_on: "Filtro poco popular (Inicio): ON",
      dock_lowpop_home_state_off: "Filtro poco popular (Inicio): OFF",
      dock_lowpop_home_label: "Videos poco populares (Inicio)",
      dock_lowpop_home_action_on: "Mostrar videos poco populares",
      dock_lowpop_home_action_off: "Ocultar videos poco populares",
      dock_lowpop_home_info: "Oculta videos por debajo del umbral de vistas en Inicio.",

      dock_lowpop_watch_state_on: "Filtro poco popular (/watch): ON",
      dock_lowpop_watch_state_off: "Filtro poco popular (/watch): OFF",
      dock_lowpop_watch_label: "Recomendaciones poco populares (/watch)",
      dock_lowpop_watch_action_on: "Mostrar recomendaciones poco populares",
      dock_lowpop_watch_action_off: "Ocultar recomendaciones poco populares",
      dock_lowpop_watch_info: "Oculta recomendaciones por debajo del umbral de vistas en /watch.",
      dock_autolike_subs_label: "Auto-like suscripciones",
      dock_autolike_subs_action_on: "Desactivar auto-like",
      dock_autolike_subs_action_off: "Activar auto-like",
      dock_autolike_subs_info: "Da like automaticamente a videos de canales suscritos.",

      dock_lowpop_search_label: "Videos poco populares (Búsqueda)",
      dock_lowpop_search_action_on: "Mostrar videos poco populares (Búsqueda)",
      dock_lowpop_search_action_off: "Ocultar videos poco populares (Búsqueda)",
      dock_lowpop_search_info: "Oculta videos por debajo del umbral de vistas en Búsqueda.",

      dock_lowlive_min_label: "Mín. espectadores en vivo",
      dock_lowlive_min_custom: "Personalizar",
      dock_lowlive_min_prompt: "Ingresa un umbral en vivo (ej.: 50, 1k)",
      dock_lowlive_min_invalid: "Valor inválido",

      dock_live_home_label: "Directos ocultos (Inicio)",
      dock_live_home_action_on: "Mostrar directos (Inicio)",
      dock_live_home_action_off: "Ocultar directos (Inicio)",
      dock_live_home_info: "Oculta directos en la página de inicio.",

      dock_live_watch_label: "Directos ocultos (/watch)",
      dock_live_watch_action_on: "Mostrar directos (/watch)",
      dock_live_watch_action_off: "Ocultar directos (/watch)",
      dock_live_watch_info: "Oculta recomendaciones en vivo en /watch.",

      dock_live_search_label: "Directos ocultos (Búsqueda)",
      dock_live_search_action_on: "Mostrar directos (Búsqueda)",
      dock_live_search_action_off: "Ocultar directos (Búsqueda)",
      dock_live_search_info: "Oculta directos en la búsqueda.",

      dock_lowlive_home_label: "Directos con pocos espectadores (Inicio)",
      dock_lowlive_home_action_on: "Mostrar directos con pocos espectadores",
      dock_lowlive_home_action_off: "Ocultar directos con pocos espectadores",
      dock_lowlive_home_info: "Oculta directos por debajo del umbral de espectadores en Inicio.",

      dock_lowlive_watch_label: "Directos con pocos espectadores (/watch)",
      dock_lowlive_watch_action_on: "Mostrar directos con pocos espectadores",
      dock_lowlive_watch_action_off: "Ocultar directos con pocos espectadores",
      dock_lowlive_watch_info: "Oculta directos por debajo del umbral de espectadores en /watch.",

      dock_lowlive_search_label: "Directos con pocos espectadores (Búsqueda)",
      dock_lowlive_search_action_on: "Mostrar directos con pocos espectadores",
      dock_lowlive_search_action_off: "Ocultar directos con pocos espectadores",
      dock_lowlive_search_info: "Oculta directos por debajo del umbral de espectadores en la búsqueda.",

      dock_header_info: "Activa el auto-ocultado del header en /watch con aparición al pasar.",
      dock_float_buttons_label: "Dock visible",
      dock_float_buttons_action_on: "Ocultar el dock",
      dock_float_buttons_action_off: "Mostrar el dock",
      dock_float_buttons_info: "Muestra u oculta el dock de botones flotantes.",
      dock_menu_home_label: "Funciones de Inicio",
      dock_menu_home_title: "Funciones de Inicio:",
      dock_menu_home_info: "Ajustes específicos de Inicio (Shorts, Noticias, videos poco populares).",
      dock_menu_general_label: "General",
      dock_menu_general_title: "General:",
      dock_menu_general_info: "Atajos globales (Shorts, Directos, filtros, etc.).",
      dock_menu_watch_label: "Funciones de Video",
      dock_menu_watch_title: "Funciones de Video:",
      dock_menu_watch_info: "Ajustes de la página de video (/watch).",
      dock_menu_search_label: "Funciones de Búsqueda",
      dock_menu_search_title: "Funciones de Búsqueda:",
      dock_menu_search_info: "Opciones centradas en resultados y estantes de búsqueda.",
      dock_menu_sidebar_label: "Funciones del Menú lateral",
      dock_menu_sidebar_title: "Funciones del Menú lateral:",
      dock_menu_sidebar_info: "Controles del acceso al menú lateral.",
      dock_menu_adv_label: "Avanzado",
      dock_menu_adv_title: "Avanzado:",
      dock_menu_adv_info: "Opciones avanzadas del dock (visibilidad, etc.).",
      dock_menu_back: "Volver ◀️",

      dock_master_shorts_label: "Eliminar Shorts por completo",
      dock_master_shorts_action_on: "Mostrar todos los Shorts",
      dock_master_shorts_action_off: "Ocultar todos los Shorts",
      dock_master_shorts_info: "Activa todas las opciones relacionadas con Shorts (Inicio, Búsqueda, Menú, Bloquear página).",

      dock_master_lowpop_label: "Filtrar videos poco populares",
      dock_master_lowpop_action_on: "Mostrar videos poco populares",
      dock_master_lowpop_action_off: "Ocultar videos poco populares",
      dock_master_lowpop_info: "Activa el filtro low-pop en Inicio, Búsqueda y /watch.",

      dock_master_news_label: "Ocultar Noticias",
      dock_master_news_action_on: "Mostrar Noticias",
      dock_master_news_action_off: "Ocultar Noticias",
      dock_master_news_info: "Oculta la sección de Noticias/Top stories en Inicio.",

      dock_master_live_label: "Ocultar directos",
      dock_master_live_action_on: "Mostrar directos",
      dock_master_live_action_off: "Ocultar directos",
      dock_master_live_info: "Activa el ocultado de directos en Inicio, Búsqueda y /watch.",

      dock_master_lowlive_label: "Ocultar directos con pocos espectadores",
      dock_master_lowlive_action_on: "Mostrar directos con pocos espectadores",
      dock_master_lowlive_action_off: "Ocultar directos con pocos espectadores",
      dock_master_lowlive_info: "Activa el filtro de directos poco populares en Inicio, Búsqueda y /watch.",

      dock_master_header_label: "Auto-ocultar header (/watch)",
      dock_master_header_action_on: "Header normal",
      dock_master_header_action_off: "Header auto",
      dock_master_header_info: "Activa o desactiva el auto-ocultado del header en /watch.",

      dock_mode_state_perf: "Modo: Rendimiento",
      dock_mode_state_eco: "Modo: Ahorro",
      dock_mode_label: "Modo ahorro",
      dock_mode_action_perf: "Cambiar a modo Ahorro",
      dock_mode_action_eco: "Cambiar a modo Rendimiento",
      dock_mode_status_ultra: "Modo: Ultra Ahorro",
      dock_mode_status_eco: "Modo: Ahorro",
      dock_mode_status_perf: "Modo: Rendimiento",
      dock_mode_change: "Cambiar modo",
      dock_mode_back: "Volver",
      dock_mode_select: "Selecciona tu modo:",
      dock_mode_btn_ultra: "Ultra Ahorro",
      dock_mode_btn_eco: "Ahorro",
      dock_mode_btn_perf: "Rendimiento",
      dock_mode_info_ultra: "Ultra Ahorro:\n- Desactiva filtros poco populares\n- Desactiva auto-ocultado del header\n- Animaciones mínimas\n- Menos escaneos automáticos",
      dock_mode_info_eco: "Ahorro:\n- Escaneos en idle\n- Animaciones reducidas\n- Funciones estándar",
      dock_mode_info_perf: "Rendimiento:\n- Observers en tiempo real\n- Animaciones completas\n- Todas las funciones",

      // ✅ CLÉ MANQUANTE AJOUTÉE
      dock_go_top: "Ir al inicio de la página",
      dock_lang_label: "Idioma",
      dock_lang_auto: "Auto",

      toast_updated: "Actualizado",
      toast_reset: "Ajustes restablecidos",
      toast_mode_perf: "Modo: Rendimiento",
      toast_mode_eco: "Modo: Ahorro de recursos",
      toast_mode_ultra: "Modo: Ultra Ahorro",
      toast_btn_home_on: "Filtro de inicio: ACTIVADO (botón)",
      toast_btn_home_off: "Filtro de inicio: DESACTIVADO (botón)",
      toast_btn_watch_on: "Filtro de /watch: ACTIVADO (botón)",
      toast_btn_watch_off: "Filtro de /watch: DESACTIVADO (botón)",

      toast_header_on: "Header auto: ACTIVADO (/watch)",
      toast_header_off: "Header auto: DESACTIVADO (/watch)",
    },
    it: {
      sec_global: "Globale",
      sec_home: "Home",
      sec_search: "Ricerca",
      sec_watch: "Riproduzione (/watch)",
      sec_navui: "Navigazione e UI",
      sec_actions: "Azioni",

      mode_label: "Modalita",
      mode_perf: "Prestazioni",
      mode_eco: "Risparmio",
      mode_ultra: "Ultra Risparmio",

      opt_shorts_home: "Nascondi Shorts in Home",
      opt_shorts_search: "Nascondi Shorts nella ricerca (scaffale + risultati)",
      opt_news_home: "Nascondi Notizie/Top news in Home",
      opt_sidebar_shorts: 'Nascondi "Shorts" nella barra laterale',
      opt_block_shorts_page: "Blocca la pagina Shorts (reindirizza a Home)",

      opt_lowpop_home: "Filtra video poco popolari in Home",
      opt_lowpop_watch: "Filtra consigli poco popolari su /watch",
      opt_lowpop_search: "Filtra video poco popolari in Ricerca",

      opt_float_buttons: "Mostra dock dei pulsanti (Home + /watch)",
      opt_header_hover_watch: "Nascondi header quando non in hover (/watch)",

      act_apply: "↻ Applica ora",
      act_reset: "⟲ Reimposta tutte le impostazioni",

      status_on: "ON",
      status_off: "OFF",

      dock_collapse: "Comprimi ▼",
      dock_expand: "Impostazioni ▲",
      dock_shorts_show: "Mostra Shorts",
      dock_shorts_hide: "Nascondi Shorts",
      dock_lowpop_home_show: "Mostra video poco popolari",
      dock_lowpop_home_hide: "Nascondi video poco popolari",
      dock_lowpop_watch_show: "Mostra consigli poco popolari",
      dock_lowpop_watch_hide: "Nascondi consigli poco popolari",

      dock_header_on: "Header auto",
      dock_header_off: "Header normale",
      dock_header_state_on: "Header auto-hide: ON",
      dock_header_state_off: "Header auto-hide: OFF",
      dock_header_label: "Header auto-hide",
      dock_header_action_on: "Mostra sempre l'header",
      dock_header_action_off: "Attiva auto-hide",

      dock_shorts_state_on: "Filtro Shorts: ON",
      dock_shorts_state_off: "Filtro Shorts: OFF",
      dock_shorts_label: "Shorts nascosti",
      dock_shorts_action_on: "Mostra Shorts",
      dock_shorts_action_off: "Nascondi Shorts",
      dock_shorts_info: "Nasconde gli scaffali Shorts nella Home.",

      dock_news_label: "Notizie nascoste",
      dock_news_action_on: "Mostra Notizie",
      dock_news_action_off: "Nascondi Notizie",
      dock_news_info: "Nasconde la sezione Notizie/Top news in Home.",

      dock_shorts_search_label: "Shorts nascosti (Ricerca)",
      dock_shorts_search_action_on: "Mostra Shorts (Ricerca)",
      dock_shorts_search_action_off: "Nascondi Shorts (Ricerca)",
      dock_shorts_search_info: "Rimuove scaffali Shorts e risultati Shorts nella ricerca.",

      dock_sidebar_shorts_label: "Shorts nascosti (menu)",
      dock_sidebar_shorts_action_on: "Mostra \"Shorts\" (menu)",
      dock_sidebar_shorts_action_off: "Nascondi \"Shorts\" (menu)",
      dock_sidebar_shorts_info: "Nasconde la voce Shorts nella barra laterale.",

      dock_block_shorts_label: "Pagina Shorts bloccata",
      dock_block_shorts_action_on: "Sblocca pagina Shorts",
      dock_block_shorts_action_off: "Blocca pagina Shorts",
      dock_block_shorts_info: "Reindirizza la pagina Shorts alla Home.",

      dock_lowpop_home_state_on: "Filtro poco popolare (Home): ON",
      dock_lowpop_home_state_off: "Filtro poco popolare (Home): OFF",
      dock_lowpop_home_label: "Video poco popolari (Home)",
      dock_lowpop_home_action_on: "Mostra video poco popolari",
      dock_lowpop_home_action_off: "Nascondi video poco popolari",
      dock_lowpop_home_info: "Nasconde video sotto la soglia di visualizzazioni in Home.",

      dock_lowpop_watch_state_on: "Filtro poco popolare (/watch): ON",
      dock_lowpop_watch_state_off: "Filtro poco popolare (/watch): OFF",
      dock_lowpop_watch_label: "Consigli poco popolari (/watch)",
      dock_lowpop_watch_action_on: "Mostra consigli poco popolari",
      dock_lowpop_watch_action_off: "Nascondi consigli poco popolari",
      dock_lowpop_watch_info: "Nasconde consigli sotto la soglia di visualizzazioni su /watch.",
      dock_autolike_subs_label: "Auto-like iscrizioni",
      dock_autolike_subs_action_on: "Disattiva auto-like",
      dock_autolike_subs_action_off: "Attiva auto-like",
      dock_autolike_subs_info: "Mette like automaticamente ai video dei canali iscritti.",

      dock_lowpop_search_label: "Video poco popolari (Ricerca)",
      dock_lowpop_search_action_on: "Mostra video poco popolari (Ricerca)",
      dock_lowpop_search_action_off: "Nascondi video poco popolari (Ricerca)",
      dock_lowpop_search_info: "Nasconde video sotto la soglia di visualizzazioni nella ricerca.",

      dock_lowlive_min_label: "Min. spettatori live",
      dock_lowlive_min_custom: "Personalizza",
      dock_lowlive_min_prompt: "Inserisci una soglia live (es: 50, 1k)",
      dock_lowlive_min_invalid: "Valore non valido",

      dock_live_home_label: "Livestream nascosti (Home)",
      dock_live_home_action_on: "Mostra livestream (Home)",
      dock_live_home_action_off: "Nascondi livestream (Home)",
      dock_live_home_info: "Nasconde i livestream nella Home.",

      dock_live_watch_label: "Livestream nascosti (/watch)",
      dock_live_watch_action_on: "Mostra livestream (/watch)",
      dock_live_watch_action_off: "Nascondi livestream (/watch)",
      dock_live_watch_info: "Nasconde le raccomandazioni live su /watch.",

      dock_live_search_label: "Livestream nascosti (Ricerca)",
      dock_live_search_action_on: "Mostra livestream (Ricerca)",
      dock_live_search_action_off: "Nascondi livestream (Ricerca)",
      dock_live_search_info: "Nasconde i livestream nella ricerca.",

      dock_lowlive_home_label: "Livestream con pochi spettatori (Home)",
      dock_lowlive_home_action_on: "Mostra livestream con pochi spettatori",
      dock_lowlive_home_action_off: "Nascondi livestream con pochi spettatori",
      dock_lowlive_home_info: "Nasconde i livestream sotto la soglia spettatori in Home.",

      dock_lowlive_watch_label: "Livestream con pochi spettatori (/watch)",
      dock_lowlive_watch_action_on: "Mostra livestream con pochi spettatori",
      dock_lowlive_watch_action_off: "Nascondi livestream con pochi spettatori",
      dock_lowlive_watch_info: "Nasconde i livestream sotto la soglia spettatori su /watch.",

      dock_lowlive_search_label: "Livestream con pochi spettatori (Ricerca)",
      dock_lowlive_search_action_on: "Mostra livestream con pochi spettatori",
      dock_lowlive_search_action_off: "Nascondi livestream con pochi spettatori",
      dock_lowlive_search_info: "Nasconde i livestream sotto la soglia spettatori nella ricerca.",

      dock_header_info: "Attiva auto-hide dell'header su /watch, con comparsa al passaggio.",
      dock_float_buttons_label: "Dock visibile",
      dock_float_buttons_action_on: "Nascondi dock",
      dock_float_buttons_action_off: "Mostra dock",
      dock_float_buttons_info: "Mostra o nasconde il dock dei pulsanti flottanti.",
      dock_menu_home_label: "Funzionalita Home",
      dock_menu_home_title: "Funzionalita Home:",
      dock_menu_home_info: "Impostazioni Home (Shorts, Notizie, video poco popolari).",
      dock_menu_general_label: "Generale",
      dock_menu_general_title: "Generale:",
      dock_menu_general_info: "Scorciatoie globali (Shorts, Live, filtri, ecc.).",
      dock_menu_watch_label: "Funzionalita Video",
      dock_menu_watch_title: "Funzionalita Video:",
      dock_menu_watch_info: "Impostazioni pagina video (/watch).",
      dock_menu_search_label: "Funzionalita Ricerca",
      dock_menu_search_title: "Funzionalita Ricerca:",
      dock_menu_search_info: "Opzioni specifiche per risultati e scaffali di ricerca.",
      dock_menu_sidebar_label: "Funzionalita Barra laterale",
      dock_menu_sidebar_title: "Funzionalita Barra laterale:",
      dock_menu_sidebar_info: "Impostazioni per la barra laterale.",
      dock_menu_adv_label: "Avanzate",
      dock_menu_adv_title: "Avanzate:",
      dock_menu_adv_info: "Opzioni avanzate del dock (visibilita, ecc.).",
      dock_menu_back: "Indietro ◀️",

      dock_master_shorts_label: "Rimuovi completamente gli Shorts",
      dock_master_shorts_action_on: "Mostra tutti gli Shorts",
      dock_master_shorts_action_off: "Nascondi tutti gli Shorts",
      dock_master_shorts_info: "Abilita tutte le opzioni relative agli Shorts (Home, Ricerca, Menu laterale, Blocco pagina).",

      dock_master_lowpop_label: "Filtra video poco popolari",
      dock_master_lowpop_action_on: "Mostra video poco popolari",
      dock_master_lowpop_action_off: "Nascondi video poco popolari",
      dock_master_lowpop_info: "Abilita il filtro low-pop su Home, Ricerca e /watch.",

      dock_master_news_label: "Nascondi Notizie",
      dock_master_news_action_on: "Mostra Notizie",
      dock_master_news_action_off: "Nascondi Notizie",
      dock_master_news_info: "Nasconde la sezione Notizie/Top news in Home.",

      dock_master_live_label: "Nascondi livestream",
      dock_master_live_action_on: "Mostra livestream",
      dock_master_live_action_off: "Nascondi livestream",
      dock_master_live_info: "Abilita il nascondimento dei livestream su Home, Ricerca e /watch.",

      dock_master_lowlive_label: "Nascondi livestream con pochi spettatori",
      dock_master_lowlive_action_on: "Mostra livestream con pochi spettatori",
      dock_master_lowlive_action_off: "Nascondi livestream con pochi spettatori",
      dock_master_lowlive_info: "Abilita il filtro live poco popolari su Home, Ricerca e /watch.",

      dock_master_header_label: "Header auto-hide (/watch)",
      dock_master_header_action_on: "Header normale",
      dock_master_header_action_off: "Header auto",
      dock_master_header_info: "Abilita o disabilita l'auto-hide dell'header su /watch.",

      dock_mode_state_perf: "Modalita: Prestazioni",
      dock_mode_state_eco: "Modalita: Risparmio",
      dock_mode_label: "Modalita eco",
      dock_mode_action_perf: "Passa a Risparmio",
      dock_mode_action_eco: "Passa a Prestazioni",
      dock_mode_status_ultra: "Modalita: Ultra Risparmio",
      dock_mode_status_eco: "Modalita: Risparmio",
      dock_mode_status_perf: "Modalita: Prestazioni",
      dock_mode_change: "Cambia modalita",
      dock_mode_back: "Indietro",
      dock_mode_select: "Seleziona la tua modalita:",
      dock_mode_btn_ultra: "Ultra Risparmio",
      dock_mode_btn_eco: "Risparmio",
      dock_mode_btn_perf: "Prestazioni",
      dock_mode_info_ultra: "Ultra Risparmio:\n- Disabilita filtri poco popolari\n- Disabilita auto-hide header\n- Animazioni minime\n- Meno scansioni automatiche",
      dock_mode_info_eco: "Risparmio:\n- Scansioni in idle\n- Animazioni ridotte\n- Funzioni standard",
      dock_mode_info_perf: "Prestazioni:\n- Observer in tempo reale\n- Animazioni complete\n- Tutte le funzioni",

      dock_go_top: "Vai all'inizio della pagina",
      dock_lang_label: "Lingua",
      dock_lang_auto: "Auto",

      toast_updated: "Aggiornato",
      toast_reset: "Impostazioni reimpostate",
      toast_mode_perf: "Modalita: Prestazioni",
      toast_mode_eco: "Modalita: Risparmio risorse",
      toast_mode_ultra: "Modalita: Ultra Risparmio",
      toast_btn_home_on: "Filtro Home: ON (pulsante)",
      toast_btn_home_off: "Filtro Home: OFF (pulsante)",
      toast_btn_watch_on: "Filtro /watch: ON (pulsante)",
      toast_btn_watch_off: "Filtro /watch: OFF (pulsante)",

      toast_header_on: "Header auto: ON (/watch)",
      toast_header_off: "Header auto: OFF (/watch)",
    },
    pt: {
      sec_global: "Global",
      sec_home: "Inicio (Home)",
      sec_search: "Pesquisa",
      sec_watch: "Reproducao (/watch)",
      sec_navui: "Navegacao e UI",
      sec_actions: "Acoes",

      mode_label: "Modo",
      mode_perf: "Desempenho",
      mode_eco: "Economia",
      mode_ultra: "Ultra Economia",

      opt_shorts_home: "Ocultar Shorts na Home",
      opt_shorts_search: "Ocultar Shorts na Pesquisa (estante + resultados)",
      opt_news_home: "Ocultar Noticias/Top stories na Home",
      opt_sidebar_shorts: "Ocultar \"Shorts\" no menu lateral",
      opt_block_shorts_page: "Bloquear pagina Shorts (redirecionar para Home)",

      opt_lowpop_home: "Filtrar videos pouco populares na Home",
      opt_lowpop_watch: "Filtrar recomendacoes pouco populares em /watch",
      opt_lowpop_search: "Filtrar videos pouco populares na Pesquisa",

      opt_float_buttons: "Mostrar dock de botoes (Home + /watch)",
      opt_header_hover_watch: "Ocultar header quando nao houver hover (/watch)",

      act_apply: "↻ Aplicar agora",
      act_reset: "⟲ Redefinir todas as configuracoes",

      status_on: "ON",
      status_off: "OFF",

      dock_collapse: "Recolher ▼",
      dock_expand: "Configuracoes ▲",
      dock_shorts_show: "Mostrar Shorts",
      dock_shorts_hide: "Ocultar Shorts",
      dock_lowpop_home_show: "Mostrar videos pouco populares",
      dock_lowpop_home_hide: "Ocultar videos pouco populares",
      dock_lowpop_watch_show: "Mostrar recomendacoes pouco populares",
      dock_lowpop_watch_hide: "Ocultar recomendacoes pouco populares",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",
      dock_header_state_on: "Auto-ocultar header: ON",
      dock_header_state_off: "Auto-ocultar header: OFF",
      dock_header_label: "Auto-ocultar header",
      dock_header_action_on: "Mostrar header sempre",
      dock_header_action_off: "Ativar auto-ocultacao",

      dock_shorts_state_on: "Filtro Shorts: ON",
      dock_shorts_state_off: "Filtro Shorts: OFF",
      dock_shorts_label: "Shorts ocultos",
      dock_shorts_action_on: "Mostrar Shorts",
      dock_shorts_action_off: "Ocultar Shorts",
      dock_shorts_info: "Oculta as prateleiras de Shorts na Home.",

      dock_news_label: "Noticias ocultas",
      dock_news_action_on: "Mostrar Noticias",
      dock_news_action_off: "Ocultar Noticias",
      dock_news_info: "Oculta a secao Noticias/Top stories na Home.",

      dock_shorts_search_label: "Shorts ocultos (Pesquisa)",
      dock_shorts_search_action_on: "Mostrar Shorts (Pesquisa)",
      dock_shorts_search_action_off: "Ocultar Shorts (Pesquisa)",
      dock_shorts_search_info: "Remove prateleiras de Shorts e resultados Shorts na pesquisa.",

      dock_sidebar_shorts_label: "Shorts ocultos (menu)",
      dock_sidebar_shorts_action_on: "Mostrar \"Shorts\" (menu)",
      dock_sidebar_shorts_action_off: "Ocultar \"Shorts\" (menu)",
      dock_sidebar_shorts_info: "Oculta a entrada Shorts no menu lateral.",

      dock_block_shorts_label: "Pagina Shorts bloqueada",
      dock_block_shorts_action_on: "Desbloquear pagina Shorts",
      dock_block_shorts_action_off: "Bloquear pagina Shorts",
      dock_block_shorts_info: "Redireciona a pagina Shorts para a Home.",

      dock_lowpop_home_state_on: "Filtro pouco popular (Home): ON",
      dock_lowpop_home_state_off: "Filtro pouco popular (Home): OFF",
      dock_lowpop_home_label: "Videos pouco populares (Home)",
      dock_lowpop_home_action_on: "Mostrar videos pouco populares",
      dock_lowpop_home_action_off: "Ocultar videos pouco populares",
      dock_lowpop_home_info: "Oculta videos abaixo do limite de visualizacoes na Home.",

      dock_lowpop_watch_state_on: "Filtro pouco popular (/watch): ON",
      dock_lowpop_watch_state_off: "Filtro pouco popular (/watch): OFF",
      dock_lowpop_watch_label: "Recomendacoes pouco populares (/watch)",
      dock_lowpop_watch_action_on: "Mostrar recomendacoes pouco populares",
      dock_lowpop_watch_action_off: "Ocultar recomendacoes pouco populares",
      dock_lowpop_watch_info: "Oculta recomendacoes abaixo do limite de visualizacoes em /watch.",
      dock_autolike_subs_label: "Auto-like inscritos",
      dock_autolike_subs_action_on: "Desativar auto-like",
      dock_autolike_subs_action_off: "Ativar auto-like",
      dock_autolike_subs_info: "Da like automaticamente nos videos de canais inscritos.",

      dock_lowpop_search_label: "Videos pouco populares (Pesquisa)",
      dock_lowpop_search_action_on: "Mostrar videos pouco populares (Pesquisa)",
      dock_lowpop_search_action_off: "Ocultar videos pouco populares (Pesquisa)",
      dock_lowpop_search_info: "Oculta videos abaixo do limite de visualizacoes na pesquisa.",

      dock_lowlive_min_label: "Min. espectadores ao vivo",
      dock_lowlive_min_custom: "Personalizar",
      dock_lowlive_min_prompt: "Digite um limite ao vivo (ex: 50, 1k)",
      dock_lowlive_min_invalid: "Valor inválido",

      dock_live_home_label: "Livestreams ocultos (Home)",
      dock_live_home_action_on: "Mostrar livestreams (Home)",
      dock_live_home_action_off: "Ocultar livestreams (Home)",
      dock_live_home_info: "Oculta livestreams na Home.",

      dock_live_watch_label: "Livestreams ocultos (/watch)",
      dock_live_watch_action_on: "Mostrar livestreams (/watch)",
      dock_live_watch_action_off: "Ocultar livestreams (/watch)",
      dock_live_watch_info: "Oculta recomendacoes ao vivo em /watch.",

      dock_live_search_label: "Livestreams ocultos (Pesquisa)",
      dock_live_search_action_on: "Mostrar livestreams (Pesquisa)",
      dock_live_search_action_off: "Ocultar livestreams (Pesquisa)",
      dock_live_search_info: "Oculta livestreams na pesquisa.",

      dock_lowlive_home_label: "Livestreams com poucos espectadores (Home)",
      dock_lowlive_home_action_on: "Mostrar livestreams com poucos espectadores",
      dock_lowlive_home_action_off: "Ocultar livestreams com poucos espectadores",
      dock_lowlive_home_info: "Oculta livestreams abaixo do limite de espectadores na Home.",

      dock_lowlive_watch_label: "Livestreams com poucos espectadores (/watch)",
      dock_lowlive_watch_action_on: "Mostrar livestreams com poucos espectadores",
      dock_lowlive_watch_action_off: "Ocultar livestreams com poucos espectadores",
      dock_lowlive_watch_info: "Oculta livestreams abaixo do limite de espectadores em /watch.",

      dock_lowlive_search_label: "Livestreams com poucos espectadores (Pesquisa)",
      dock_lowlive_search_action_on: "Mostrar livestreams com poucos espectadores",
      dock_lowlive_search_action_off: "Ocultar livestreams com poucos espectadores",
      dock_lowlive_search_info: "Oculta livestreams abaixo do limite de espectadores na pesquisa.",

      dock_header_info: "Ativa auto-ocultacao do header em /watch, com exibicao ao passar o mouse.",
      dock_float_buttons_label: "Dock visivel",
      dock_float_buttons_action_on: "Ocultar dock",
      dock_float_buttons_action_off: "Mostrar dock",
      dock_float_buttons_info: "Mostra ou oculta o dock de botoes flutuantes.",
      dock_menu_home_label: "Funcionalidades da Home",
      dock_menu_home_title: "Funcionalidades da Home:",
      dock_menu_home_info: "Configuracoes da Home (Shorts, Noticias, videos pouco populares).",
      dock_menu_general_label: "Geral",
      dock_menu_general_title: "Geral:",
      dock_menu_general_info: "Atalhos globais (Shorts, Live, filtros, etc.).",
      dock_menu_watch_label: "Funcionalidades de Video",
      dock_menu_watch_title: "Funcionalidades de Video:",
      dock_menu_watch_info: "Configuracoes da pagina de video (/watch).",
      dock_menu_search_label: "Funcionalidades de Pesquisa",
      dock_menu_search_title: "Funcionalidades de Pesquisa:",
      dock_menu_search_info: "Opcoes especificas para resultados e prateleiras de pesquisa.",
      dock_menu_sidebar_label: "Funcionalidades do Menu lateral",
      dock_menu_sidebar_title: "Funcionalidades do Menu lateral:",
      dock_menu_sidebar_info: "Configuracoes para entradas do menu lateral.",
      dock_menu_adv_label: "Avancado",
      dock_menu_adv_title: "Avancado:",
      dock_menu_adv_info: "Opcoes avancadas do dock (visibilidade, etc.).",
      dock_menu_back: "Voltar ◀️",

      dock_master_shorts_label: "Remover Shorts completamente",
      dock_master_shorts_action_on: "Mostrar todos os Shorts",
      dock_master_shorts_action_off: "Ocultar todos os Shorts",
      dock_master_shorts_info: "Ativa todas as opcoes relacionadas aos Shorts (Home, Pesquisa, Menu, Bloquear pagina).",

      dock_master_lowpop_label: "Filtrar videos pouco populares",
      dock_master_lowpop_action_on: "Mostrar videos pouco populares",
      dock_master_lowpop_action_off: "Ocultar videos pouco populares",
      dock_master_lowpop_info: "Ativa o filtro low-pop na Home, Pesquisa e /watch.",

      dock_master_news_label: "Ocultar Noticias",
      dock_master_news_action_on: "Mostrar Noticias",
      dock_master_news_action_off: "Ocultar Noticias",
      dock_master_news_info: "Oculta a secao Noticias/Top stories na Home.",

      dock_master_live_label: "Ocultar livestreams",
      dock_master_live_action_on: "Mostrar livestreams",
      dock_master_live_action_off: "Ocultar livestreams",
      dock_master_live_info: "Ativa o ocultamento de livestreams na Home, Pesquisa e /watch.",

      dock_master_lowlive_label: "Ocultar livestreams com poucos espectadores",
      dock_master_lowlive_action_on: "Mostrar livestreams com poucos espectadores",
      dock_master_lowlive_action_off: "Ocultar livestreams com poucos espectadores",
      dock_master_lowlive_info: "Ativa o filtro de live pouco populares na Home, Pesquisa e /watch.",

      dock_master_header_label: "Auto-ocultar header (/watch)",
      dock_master_header_action_on: "Header normal",
      dock_master_header_action_off: "Header auto",
      dock_master_header_info: "Ativa ou desativa o auto-ocultacao do header em /watch.",

      dock_mode_state_perf: "Modo: Desempenho",
      dock_mode_state_eco: "Modo: Economia",
      dock_mode_label: "Modo economia",
      dock_mode_action_perf: "Mudar para Economia",
      dock_mode_action_eco: "Mudar para Desempenho",
      dock_mode_status_ultra: "Modo: Ultra Economia",
      dock_mode_status_eco: "Modo: Economia",
      dock_mode_status_perf: "Modo: Desempenho",
      dock_mode_change: "Mudar modo",
      dock_mode_back: "Voltar",
      dock_mode_select: "Selecione seu modo:",
      dock_mode_btn_ultra: "Ultra Economia",
      dock_mode_btn_eco: "Economia",
      dock_mode_btn_perf: "Desempenho",
      dock_mode_info_ultra: "Ultra Economia:\n- Desativa filtros pouco populares\n- Desativa auto-ocultacao do header\n- Animacoes minimas\n- Menos varreduras automaticas",
      dock_mode_info_eco: "Economia:\n- Varreduras em idle\n- Animacoes reduzidas\n- Funcoes padrao",
      dock_mode_info_perf: "Desempenho:\n- Observers em tempo real\n- Animacoes completas\n- Todas as funcoes",

      dock_go_top: "Ir para o topo da pagina",
      dock_lang_label: "Idioma",
      dock_lang_auto: "Auto",

      toast_updated: "Atualizado",
      toast_reset: "Configuracoes redefinidas",
      toast_mode_perf: "Modo: Desempenho",
      toast_mode_eco: "Modo: Economia de recursos",
      toast_mode_ultra: "Modo: Ultra Economia",
      toast_btn_home_on: "Filtro Home: ON (botao)",
      toast_btn_home_off: "Filtro Home: OFF (botao)",
      toast_btn_watch_on: "Filtro /watch: ON (botao)",
      toast_btn_watch_off: "Filtro /watch: OFF (botao)",

      toast_header_on: "Header auto: ON (/watch)",
      toast_header_off: "Header auto: OFF (/watch)",
    },
    nl: {
      sec_global: "Algemeen",
      sec_home: "Home",
      sec_search: "Zoeken",
      sec_watch: "Bekijken (/watch)",
      sec_navui: "Navigatie en UI",
      sec_actions: "Acties",

      mode_label: "Modus",
      mode_perf: "Prestatie",
      mode_eco: "Besparen",
      mode_ultra: "Ultra Besparen",

      opt_shorts_home: "Shorts verbergen op Home",
      opt_shorts_search: "Shorts verbergen in Zoeken (shelf + resultaten)",
      opt_news_home: "Nieuws/Top stories verbergen op Home",
      opt_sidebar_shorts: "\"Shorts\" verbergen in zijbalk",
      opt_block_shorts_page: "Shorts-pagina blokkeren (omleiden naar Home)",

      opt_lowpop_home: "Weinig populaire video's filteren op Home",
      opt_lowpop_watch: "Weinig populaire aanbevelingen filteren op /watch",
      opt_lowpop_search: "Weinig populaire video's filteren in Zoeken",

      opt_float_buttons: "Knoppendock tonen (Home + /watch)",
      opt_header_hover_watch: "Header verbergen wanneer niet gehoverd (/watch)",

      act_apply: "↻ Nu toepassen",
      act_reset: "⟲ Alle instellingen resetten",

      status_on: "AAN",
      status_off: "UIT",

      dock_collapse: "Inklappen ▼",
      dock_expand: "Instellingen ▲",
      dock_shorts_show: "Shorts tonen",
      dock_shorts_hide: "Shorts verbergen",
      dock_lowpop_home_show: "Onpopulaire video's tonen",
      dock_lowpop_home_hide: "Onpopulaire video's verbergen",
      dock_lowpop_watch_show: "Onpopulaire aanbevelingen tonen",
      dock_lowpop_watch_hide: "Onpopulaire aanbevelingen verbergen",

      dock_header_on: "Header auto",
      dock_header_off: "Header normaal",
      dock_header_state_on: "Header auto-hide: AAN",
      dock_header_state_off: "Header auto-hide: UIT",
      dock_header_label: "Header auto-hide",
      dock_header_action_on: "Header altijd tonen",
      dock_header_action_off: "Auto-hide inschakelen",

      dock_shorts_state_on: "Shorts-filter: AAN",
      dock_shorts_state_off: "Shorts-filter: UIT",
      dock_shorts_label: "Shorts verborgen",
      dock_shorts_action_on: "Shorts tonen",
      dock_shorts_action_off: "Shorts verbergen",
      dock_shorts_info: "Verbergt Shorts-shelves op de Home-feed.",

      dock_news_label: "Nieuws verborgen",
      dock_news_action_on: "Nieuws tonen",
      dock_news_action_off: "Nieuws verbergen",
      dock_news_info: "Verbergt de Nieuws/Top stories-sectie op Home.",

      dock_shorts_search_label: "Shorts verborgen (Zoeken)",
      dock_shorts_search_action_on: "Shorts tonen (Zoeken)",
      dock_shorts_search_action_off: "Shorts verbergen (Zoeken)",
      dock_shorts_search_info: "Verwijdert Shorts-shelves en Shorts-resultaten in Zoeken.",

      dock_sidebar_shorts_label: "Shorts verborgen (menu)",
      dock_sidebar_shorts_action_on: "\"Shorts\" tonen (menu)",
      dock_sidebar_shorts_action_off: "\"Shorts\" verbergen (menu)",
      dock_sidebar_shorts_info: "Verbergt de Shorts-item in de zijbalk.",

      dock_block_shorts_label: "Shorts-pagina geblokkeerd",
      dock_block_shorts_action_on: "Shorts-pagina deblokkeren",
      dock_block_shorts_action_off: "Shorts-pagina blokkeren",
      dock_block_shorts_info: "Leidt de Shorts-pagina terug naar Home.",

      dock_lowpop_home_state_on: "Low-pop filter (Home): AAN",
      dock_lowpop_home_state_off: "Low-pop filter (Home): UIT",
      dock_lowpop_home_label: "Weinig populaire video's (Home)",
      dock_lowpop_home_action_on: "Onpopulaire video's tonen",
      dock_lowpop_home_action_off: "Onpopulaire video's verbergen",
      dock_lowpop_home_info: "Verbergt video's onder de weergavedrempel op Home.",

      dock_lowpop_watch_state_on: "Low-pop filter (/watch): AAN",
      dock_lowpop_watch_state_off: "Low-pop filter (/watch): UIT",
      dock_lowpop_watch_label: "Onpopulaire aanbevelingen (/watch)",
      dock_lowpop_watch_action_on: "Onpopulaire aanbevelingen tonen",
      dock_lowpop_watch_action_off: "Onpopulaire aanbevelingen verbergen",
      dock_lowpop_watch_info: "Verbergt aanbevelingen onder de weergavedrempel op /watch.",
      dock_autolike_subs_label: "Auto-like abonnementen",
      dock_autolike_subs_action_on: "Auto-like uitschakelen",
      dock_autolike_subs_action_off: "Auto-like inschakelen",
      dock_autolike_subs_info: "Geeft automatisch een like aan videos van geabonneerde kanalen.",

      dock_lowpop_search_label: "Onpopulaire video's (Zoeken)",
      dock_lowpop_search_action_on: "Onpopulaire video's tonen (Zoeken)",
      dock_lowpop_search_action_off: "Onpopulaire video's verbergen (Zoeken)",
      dock_lowpop_search_info: "Verbergt video's onder de weergavedrempel in Zoeken.",

      dock_lowlive_min_label: "Min. live kijkers",
      dock_lowlive_min_custom: "Aanpassen",
      dock_lowlive_min_prompt: "Voer een live-drempel in (bijv. 50, 1k)",
      dock_lowlive_min_invalid: "Ongeldige waarde",

      dock_live_home_label: "Livestreams verborgen (Home)",
      dock_live_home_action_on: "Livestreams tonen (Home)",
      dock_live_home_action_off: "Livestreams verbergen (Home)",
      dock_live_home_info: "Verbergt livestreams op Home.",

      dock_live_watch_label: "Livestreams verborgen (/watch)",
      dock_live_watch_action_on: "Livestreams tonen (/watch)",
      dock_live_watch_action_off: "Livestreams verbergen (/watch)",
      dock_live_watch_info: "Verbergt live-aanbevelingen op /watch.",

      dock_live_search_label: "Livestreams verborgen (Zoeken)",
      dock_live_search_action_on: "Livestreams tonen (Zoeken)",
      dock_live_search_action_off: "Livestreams verbergen (Zoeken)",
      dock_live_search_info: "Verbergt livestreams in Zoeken.",

      dock_lowlive_home_label: "Livestreams met weinig kijkers (Home)",
      dock_lowlive_home_action_on: "Livestreams met weinig kijkers tonen",
      dock_lowlive_home_action_off: "Livestreams met weinig kijkers verbergen",
      dock_lowlive_home_info: "Verbergt livestreams onder de kijkersdrempel op Home.",

      dock_lowlive_watch_label: "Livestreams met weinig kijkers (/watch)",
      dock_lowlive_watch_action_on: "Livestreams met weinig kijkers tonen",
      dock_lowlive_watch_action_off: "Livestreams met weinig kijkers verbergen",
      dock_lowlive_watch_info: "Verbergt livestreams onder de kijkersdrempel op /watch.",

      dock_lowlive_search_label: "Livestreams met weinig kijkers (Zoeken)",
      dock_lowlive_search_action_on: "Livestreams met weinig kijkers tonen",
      dock_lowlive_search_action_off: "Livestreams met weinig kijkers verbergen",
      dock_lowlive_search_info: "Verbergt livestreams onder de kijkersdrempel in Zoeken.",

      dock_header_info: "Schakelt auto-hide in voor de header op /watch, met tonen bij hover.",
      dock_float_buttons_label: "Dock zichtbaar",
      dock_float_buttons_action_on: "Dock verbergen",
      dock_float_buttons_action_off: "Dock tonen",
      dock_float_buttons_info: "Toont of verbergt het zwevende knoppendock.",
      dock_menu_home_label: "Home-functies",
      dock_menu_home_title: "Home-functies:",
      dock_menu_home_info: "Home-specifieke instellingen (Shorts, Nieuws, onpopulaire video's).",
      dock_menu_general_label: "Algemeen",
      dock_menu_general_title: "Algemeen:",
      dock_menu_general_info: "Globale snelkoppelingen (Shorts, Live, filters, enz.).",
      dock_menu_watch_label: "Video-functies",
      dock_menu_watch_title: "Video-functies:",
      dock_menu_watch_info: "Instellingen voor de videopagina (/watch).",
      dock_menu_search_label: "Zoek-functies",
      dock_menu_search_title: "Zoek-functies:",
      dock_menu_search_info: "Zoek-specifieke filters en shelves.",
      dock_menu_sidebar_label: "Zijbalk-functies",
      dock_menu_sidebar_title: "Zijbalk-functies:",
      dock_menu_sidebar_info: "Zichtbaarheid van zijbalk-items.",
      dock_menu_adv_label: "Geavanceerd",
      dock_menu_adv_title: "Geavanceerd:",
      dock_menu_adv_info: "Geavanceerde dock-opties (zichtbaarheid, enz.).",
      dock_menu_back: "Terug ◀️",

      dock_master_shorts_label: "Shorts volledig verwijderen",
      dock_master_shorts_action_on: "Alle Shorts tonen",
      dock_master_shorts_action_off: "Alle Shorts verbergen",
      dock_master_shorts_info: "Schakelt alle Shorts-gerelateerde opties in (Home, Zoeken, Zijbalk, Pagina blokkeren).",

      dock_master_lowpop_label: "Onpopulaire video's filteren",
      dock_master_lowpop_action_on: "Onpopulaire video's tonen",
      dock_master_lowpop_action_off: "Onpopulaire video's verbergen",
      dock_master_lowpop_info: "Schakelt low-pop filter in op Home, Zoeken en /watch.",

      dock_master_news_label: "Nieuws verbergen",
      dock_master_news_action_on: "Nieuws tonen",
      dock_master_news_action_off: "Nieuws verbergen",
      dock_master_news_info: "Verbergt de Nieuws/Top stories-sectie op Home.",

      dock_master_live_label: "Livestreams verbergen",
      dock_master_live_action_on: "Livestreams tonen",
      dock_master_live_action_off: "Livestreams verbergen",
      dock_master_live_info: "Schakelt het verbergen van livestreams in op Home, Zoeken en /watch.",

      dock_master_lowlive_label: "Livestreams met weinig kijkers verbergen",
      dock_master_lowlive_action_on: "Livestreams met weinig kijkers tonen",
      dock_master_lowlive_action_off: "Livestreams met weinig kijkers verbergen",
      dock_master_lowlive_info: "Schakelt low-live filter in op Home, Zoeken en /watch.",

      dock_master_header_label: "Header auto-hide (/watch)",
      dock_master_header_action_on: "Header normaal",
      dock_master_header_action_off: "Header auto",
      dock_master_header_info: "Schakelt automatisch verbergen van de header op /watch in of uit.",

      dock_mode_state_perf: "Modus: Prestatie",
      dock_mode_state_eco: "Modus: Besparen",
      dock_mode_label: "Eco-modus",
      dock_mode_action_perf: "Schakel naar Besparen",
      dock_mode_action_eco: "Schakel naar Prestatie",
      dock_mode_status_ultra: "Modus: Ultra Besparen",
      dock_mode_status_eco: "Modus: Besparen",
      dock_mode_status_perf: "Modus: Prestatie",
      dock_mode_change: "Modus wijzigen",
      dock_mode_back: "Terug",
      dock_mode_select: "Selecteer je modus:",
      dock_mode_btn_ultra: "Ultra Besparen",
      dock_mode_btn_eco: "Besparen",
      dock_mode_btn_perf: "Prestatie",
      dock_mode_info_ultra: "Ultra Besparen:\n- Schakelt low-pop filters uit\n- Schakelt header auto-hide uit\n- Minimale animaties\n- Minder automatische scans",
      dock_mode_info_eco: "Besparen:\n- Scans tijdens idle\n- Minder animaties\n- Standaardfuncties",
      dock_mode_info_perf: "Prestatie:\n- Realtime observers\n- Volledige animaties\n- Alle functies",

      dock_go_top: "Ga naar de bovenkant van de pagina",
      dock_lang_label: "Taal",
      dock_lang_auto: "Auto",

      toast_updated: "Bijgewerkt",
      toast_reset: "Instellingen gereset",
      toast_mode_perf: "Modus: Prestatie",
      toast_mode_eco: "Modus: Besparen",
      toast_mode_ultra: "Modus: Ultra Besparen",
      toast_btn_home_on: "Home-filter: AAN (knop)",
      toast_btn_home_off: "Home-filter: UIT (knop)",
      toast_btn_watch_on: "Watch-filter: AAN (knop)",
      toast_btn_watch_off: "Watch-filter: UIT (knop)",

      toast_header_on: "Header auto: AAN (/watch)",
      toast_header_off: "Header auto: UIT (/watch)",
    },
    pl: {
      sec_global: "Globalne",
      sec_home: "Strona glowna (Home)",
      sec_search: "Wyszukiwanie",
      sec_watch: "Odtwarzanie (/watch)",
      sec_navui: "Nawigacja i interfejs",
      sec_actions: "Akcje",

      mode_label: "Tryb",
      mode_perf: "Wydajnosc",
      mode_eco: "Oszczedny",
      mode_ultra: "Ultra oszczedny",

      opt_shorts_home: "Ukryj Shorts na stronie glownej",
      opt_shorts_search: "Ukryj Shorts w wyszukiwaniu (polka + wyniki)",
      opt_news_home: "Ukryj Wiadomosci/Top news na Home",
      opt_sidebar_shorts: "Ukryj \"Shorts\" w pasku bocznym",
      opt_block_shorts_page: "Zablokuj strone Shorts (przekieruj na Home)",

      opt_lowpop_home: "Filtruj malo popularne filmy na Home",
      opt_lowpop_watch: "Filtruj malo popularne rekomendacje na /watch",
      opt_lowpop_search: "Filtruj malo popularne filmy w wyszukiwaniu",

      opt_float_buttons: "Pokaz dock przyciskow (Home + /watch)",
      opt_header_hover_watch: "Ukryj naglowek, gdy brak hover (/watch)",

      act_apply: "↻ Zastosuj teraz",
      act_reset: "⟲ Zresetuj wszystkie ustawienia",

      status_on: "WL",
      status_off: "WYL",

      dock_collapse: "Zwin ▼",
      dock_expand: "Ustawienia ▲",
      dock_shorts_show: "Pokaz Shorts",
      dock_shorts_hide: "Ukryj Shorts",
      dock_lowpop_home_show: "Pokaz malo popularne filmy",
      dock_lowpop_home_hide: "Ukryj malo popularne filmy",
      dock_lowpop_watch_show: "Pokaz malo popularne rekomendacje",
      dock_lowpop_watch_hide: "Ukryj malo popularne rekomendacje",

      dock_header_on: "Naglowek auto",
      dock_header_off: "Naglowek normalny",
      dock_header_state_on: "Auto-ukrywanie naglowka: WL",
      dock_header_state_off: "Auto-ukrywanie naglowka: WYL",
      dock_header_label: "Auto-ukrywanie naglowka",
      dock_header_action_on: "Zawsze pokazuj naglowek",
      dock_header_action_off: "Wlacz auto-ukrywanie",

      dock_shorts_state_on: "Filtr Shorts: WL",
      dock_shorts_state_off: "Filtr Shorts: WYL",
      dock_shorts_label: "Shorts ukryte",
      dock_shorts_action_on: "Pokaz Shorts",
      dock_shorts_action_off: "Ukryj Shorts",
      dock_shorts_info: "Ukrywa polki Shorts na stronie glownej.",

      dock_news_label: "Wiadomosci ukryte",
      dock_news_action_on: "Pokaz wiadomosci",
      dock_news_action_off: "Ukryj wiadomosci",
      dock_news_info: "Ukrywa sekcje Wiadomosci/Top news na Home.",

      dock_shorts_search_label: "Shorts ukryte (Wyszukiwanie)",
      dock_shorts_search_action_on: "Pokaz Shorts (Wyszukiwanie)",
      dock_shorts_search_action_off: "Ukryj Shorts (Wyszukiwanie)",
      dock_shorts_search_info: "Usuwa polki Shorts i wyniki Shorts w wyszukiwaniu.",

      dock_sidebar_shorts_label: "Shorts ukryte (menu)",
      dock_sidebar_shorts_action_on: "Pokaz \"Shorts\" (menu)",
      dock_sidebar_shorts_action_off: "Ukryj \"Shorts\" (menu)",
      dock_sidebar_shorts_info: "Ukrywa wpis Shorts w pasku bocznym.",

      dock_block_shorts_label: "Strona Shorts zablokowana",
      dock_block_shorts_action_on: "Odblokuj strone Shorts",
      dock_block_shorts_action_off: "Zablokuj strone Shorts",
      dock_block_shorts_info: "Przekierowuje strone Shorts na Home.",

      dock_lowpop_home_state_on: "Filtr low-pop (Home): WL",
      dock_lowpop_home_state_off: "Filtr low-pop (Home): WYL",
      dock_lowpop_home_label: "Malo popularne filmy (Home)",
      dock_lowpop_home_action_on: "Pokaz malo popularne filmy",
      dock_lowpop_home_action_off: "Ukryj malo popularne filmy",
      dock_lowpop_home_info: "Ukrywa filmy ponizej progu wyswietlen na Home.",

      dock_lowpop_watch_state_on: "Filtr low-pop (/watch): WL",
      dock_lowpop_watch_state_off: "Filtr low-pop (/watch): WYL",
      dock_lowpop_watch_label: "Malo popularne rekomendacje (/watch)",
      dock_lowpop_watch_action_on: "Pokaz malo popularne rekomendacje",
      dock_lowpop_watch_action_off: "Ukryj malo popularne rekomendacje",
      dock_lowpop_watch_info: "Ukrywa rekomendacje ponizej progu wyswietlen na /watch.",
      dock_autolike_subs_label: "Auto-like subskrypcje",
      dock_autolike_subs_action_on: "Wylacz auto-like",
      dock_autolike_subs_action_off: "Wlacz auto-like",
      dock_autolike_subs_info: "Automatycznie daje like filmom z subskrybowanych kanalow.",

      dock_lowpop_search_label: "Malo popularne filmy (Wyszukiwanie)",
      dock_lowpop_search_action_on: "Pokaz malo popularne filmy (Wyszukiwanie)",
      dock_lowpop_search_action_off: "Ukryj malo popularne filmy (Wyszukiwanie)",
      dock_lowpop_search_info: "Ukrywa filmy ponizej progu wyswietlen w wyszukiwaniu.",

      dock_lowlive_min_label: "Min. widzow na zywo",
      dock_lowlive_min_custom: "Dostosuj",
      dock_lowlive_min_prompt: "Wpisz prog live (np. 50, 1k)",
      dock_lowlive_min_invalid: "Nieprawidlowa wartosc",

      dock_live_home_label: "Livestreamy ukryte (Home)",
      dock_live_home_action_on: "Pokaz livestreamy (Home)",
      dock_live_home_action_off: "Ukryj livestreamy (Home)",
      dock_live_home_info: "Ukrywa livestreamy na Home.",

      dock_live_watch_label: "Livestreamy ukryte (/watch)",
      dock_live_watch_action_on: "Pokaz livestreamy (/watch)",
      dock_live_watch_action_off: "Ukryj livestreamy (/watch)",
      dock_live_watch_info: "Ukrywa rekomendacje live na /watch.",

      dock_live_search_label: "Livestreamy ukryte (Wyszukiwanie)",
      dock_live_search_action_on: "Pokaz livestreamy (Wyszukiwanie)",
      dock_live_search_action_off: "Ukryj livestreamy (Wyszukiwanie)",
      dock_live_search_info: "Ukrywa livestreamy w wyszukiwaniu.",

      dock_lowlive_home_label: "Livestreamy z mala liczba widzow (Home)",
      dock_lowlive_home_action_on: "Pokaz livestreamy z mala liczba widzow",
      dock_lowlive_home_action_off: "Ukryj livestreamy z mala liczba widzow",
      dock_lowlive_home_info: "Ukrywa livestreamy ponizej progu widzow na Home.",

      dock_lowlive_watch_label: "Livestreamy z mala liczba widzow (/watch)",
      dock_lowlive_watch_action_on: "Pokaz livestreamy z mala liczba widzow",
      dock_lowlive_watch_action_off: "Ukryj livestreamy z mala liczba widzow",
      dock_lowlive_watch_info: "Ukrywa livestreamy ponizej progu widzow na /watch.",

      dock_lowlive_search_label: "Livestreamy z mala liczba widzow (Wyszukiwanie)",
      dock_lowlive_search_action_on: "Pokaz livestreamy z mala liczba widzow",
      dock_lowlive_search_action_off: "Ukryj livestreamy z mala liczba widzow",
      dock_lowlive_search_info: "Ukrywa livestreamy ponizej progu widzow w wyszukiwaniu.",

      dock_header_info: "Wlacza auto-ukrywanie naglowka na /watch, z pokazaniem po najechaniu.",
      dock_float_buttons_label: "Dock widoczny",
      dock_float_buttons_action_on: "Ukryj dock",
      dock_float_buttons_action_off: "Pokaz dock",
      dock_float_buttons_info: "Pokazuje lub ukrywa plywajacy dock przyciskow.",
      dock_menu_home_label: "Funkcje Home",
      dock_menu_home_title: "Funkcje Home:",
      dock_menu_home_info: "Ustawienia Home (Shorts, Wiadomosci, malo popularne filmy).",
      dock_menu_general_label: "Ogolne",
      dock_menu_general_title: "Ogolne:",
      dock_menu_general_info: "Globalne skroty (Shorts, Live, filtry itd.).",
      dock_menu_watch_label: "Funkcje wideo",
      dock_menu_watch_title: "Funkcje wideo:",
      dock_menu_watch_info: "Ustawienia strony wideo (/watch).",
      dock_menu_search_label: "Funkcje wyszukiwania",
      dock_menu_search_title: "Funkcje wyszukiwania:",
      dock_menu_search_info: "Filtry i polki wynikow wyszukiwania.",
      dock_menu_sidebar_label: "Funkcje paska bocznego",
      dock_menu_sidebar_title: "Funkcje paska bocznego:",
      dock_menu_sidebar_info: "Widocznosc wpisow paska bocznego.",
      dock_menu_adv_label: "Zaawansowane",
      dock_menu_adv_title: "Zaawansowane:",
      dock_menu_adv_info: "Zaawansowane opcje docka (widocznosc, itp.).",
      dock_menu_back: "Wstecz ◀️",

      dock_master_shorts_label: "Usun Shorts calkowicie",
      dock_master_shorts_action_on: "Pokaz wszystkie Shorts",
      dock_master_shorts_action_off: "Ukryj wszystkie Shorts",
      dock_master_shorts_info: "Wlacza wszystkie opcje zwiazane z Shorts (Home, Wyszukiwanie, Menu, Blokada strony).",

      dock_master_lowpop_label: "Filtruj malo popularne filmy",
      dock_master_lowpop_action_on: "Pokaz malo popularne filmy",
      dock_master_lowpop_action_off: "Ukryj malo popularne filmy",
      dock_master_lowpop_info: "Wlacza filtr low-pop na Home, Wyszukiwanie i /watch.",

      dock_master_news_label: "Ukryj Wiadomosci",
      dock_master_news_action_on: "Pokaz Wiadomosci",
      dock_master_news_action_off: "Ukryj Wiadomosci",
      dock_master_news_info: "Ukrywa sekcje Wiadomosci/Top news na Home.",

      dock_master_live_label: "Ukryj livestreamy",
      dock_master_live_action_on: "Pokaz livestreamy",
      dock_master_live_action_off: "Ukryj livestreamy",
      dock_master_live_info: "Wlacza ukrywanie livestreamow na Home, Wyszukiwanie i /watch.",

      dock_master_lowlive_label: "Ukryj livestreamy z mala liczba widzow",
      dock_master_lowlive_action_on: "Pokaz livestreamy z mala liczba widzow",
      dock_master_lowlive_action_off: "Ukryj livestreamy z mala liczba widzow",
      dock_master_lowlive_info: "Wlacza filtr live o niskiej popularnosci na Home, Wyszukiwanie i /watch.",

      dock_master_header_label: "Auto-ukrywanie naglowka (/watch)",
      dock_master_header_action_on: "Naglowek normalny",
      dock_master_header_action_off: "Naglowek auto",
      dock_master_header_info: "Wlacza lub wylacza auto-ukrywanie naglowka na /watch.",

      dock_mode_state_perf: "Tryb: Wydajnosc",
      dock_mode_state_eco: "Tryb: Oszczedny",
      dock_mode_label: "Tryb eco",
      dock_mode_action_perf: "Przelacz na Oszczedny",
      dock_mode_action_eco: "Przelacz na Wydajnosc",
      dock_mode_status_ultra: "Tryb: Ultra oszczedny",
      dock_mode_status_eco: "Tryb: Oszczedny",
      dock_mode_status_perf: "Tryb: Wydajnosc",
      dock_mode_change: "Zmien tryb",
      dock_mode_back: "Wstecz",
      dock_mode_select: "Wybierz tryb:",
      dock_mode_btn_ultra: "Ultra oszczedny",
      dock_mode_btn_eco: "Oszczedny",
      dock_mode_btn_perf: "Wydajnosc",
      dock_mode_info_ultra: "Ultra oszczedny:\n- Wylacza filtry low-pop\n- Wylacza auto-ukrywanie naglowka\n- Minimalne animacje\n- Mniej automatycznych skanow",
      dock_mode_info_eco: "Oszczedny:\n- Skanowanie w idle\n- Mniej animacji\n- Standardowe funkcje",
      dock_mode_info_perf: "Wydajnosc:\n- Obserwatory w czasie rzeczywistym\n- Pelne animacje\n- Wszystkie funkcje",

      dock_go_top: "Przejdz na gore strony",
      dock_lang_label: "Jezyk",
      dock_lang_auto: "Auto",

      toast_updated: "Zaktualizowano",
      toast_reset: "Ustawienia zresetowane",
      toast_mode_perf: "Tryb: Wydajnosc",
      toast_mode_eco: "Tryb: Oszczedny",
      toast_mode_ultra: "Tryb: Ultra oszczedny",
      toast_btn_home_on: "Filtr Home: WL (przycisk)",
      toast_btn_home_off: "Filtr Home: WYL (przycisk)",
      toast_btn_watch_on: "Filtr /watch: WL (przycisk)",
      toast_btn_watch_off: "Filtr /watch: WYL (przycisk)",

      toast_header_on: "Header auto: WL (/watch)",
      toast_header_off: "Header auto: WYL (/watch)",
    },
    tr: {
      sec_global: "Genel",
      sec_home: "Ana Sayfa (Home)",
      sec_search: "Arama",
      sec_watch: "Izleme (/watch)",
      sec_navui: "Gezinme ve Arayuz",
      sec_actions: "Eylemler",

      mode_label: "Mod",
      mode_perf: "Performans",
      mode_eco: "Tasarruf",
      mode_ultra: "Ultra Tasarruf",

      opt_shorts_home: "Ana sayfada Shorts'u gizle",
      opt_shorts_search: "Aramada Shorts'u gizle (raf + sonuclar)",
      opt_news_home: "Ana sayfada Haberler/Top news gizle",
      opt_sidebar_shorts: "Yan menude \"Shorts\"u gizle",
      opt_block_shorts_page: "Shorts sayfasini engelle (Ana sayfaya yonlendir)",

      opt_lowpop_home: "Ana sayfada az populer videolari filtrele",
      opt_lowpop_watch: "/watch uzerinde az populer onerileri filtrele",
      opt_lowpop_search: "Aramada az populer videolari filtrele",

      opt_float_buttons: "Buton dock'u goster (Home + /watch)",
      opt_header_hover_watch: "Hover yokken header gizle (/watch)",

      act_apply: "↻ Simdi uygula",
      act_reset: "⟲ Tum ayarlari sifirla",

      status_on: "ACIK",
      status_off: "KAPALI",

      dock_collapse: "Daralt ▼",
      dock_expand: "Ayarlar ▲",
      dock_shorts_show: "Shorts'u goster",
      dock_shorts_hide: "Shorts'u gizle",
      dock_lowpop_home_show: "Az populer videolari goster",
      dock_lowpop_home_hide: "Az populer videolari gizle",
      dock_lowpop_watch_show: "Az populer onerileri goster",
      dock_lowpop_watch_hide: "Az populer onerileri gizle",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",
      dock_header_state_on: "Header auto-hide: ACIK",
      dock_header_state_off: "Header auto-hide: KAPALI",
      dock_header_label: "Header auto-hide",
      dock_header_action_on: "Header'i her zaman goster",
      dock_header_action_off: "Auto-hide etkinlestir",

      dock_shorts_state_on: "Shorts filtresi: ACIK",
      dock_shorts_state_off: "Shorts filtresi: KAPALI",
      dock_shorts_label: "Shorts gizli",
      dock_shorts_action_on: "Shorts'u goster",
      dock_shorts_action_off: "Shorts'u gizle",
      dock_shorts_info: "Ana sayfada Shorts raflarini gizler.",

      dock_news_label: "Haberler gizli",
      dock_news_action_on: "Haberleri goster",
      dock_news_action_off: "Haberleri gizle",
      dock_news_info: "Ana sayfada Haberler/Top news bolumunu gizler.",

      dock_shorts_search_label: "Shorts gizli (Arama)",
      dock_shorts_search_action_on: "Shorts'u goster (Arama)",
      dock_shorts_search_action_off: "Shorts'u gizle (Arama)",
      dock_shorts_search_info: "Aramada Shorts raflarini ve Shorts sonuclarini kaldirir.",

      dock_sidebar_shorts_label: "Shorts gizli (menu)",
      dock_sidebar_shorts_action_on: "\"Shorts\"u goster (menu)",
      dock_sidebar_shorts_action_off: "\"Shorts\"u gizle (menu)",
      dock_sidebar_shorts_info: "Yan menudeki Shorts girisini gizler.",

      dock_block_shorts_label: "Shorts sayfasi engelli",
      dock_block_shorts_action_on: "Shorts sayfasini ac",
      dock_block_shorts_action_off: "Shorts sayfasini engelle",
      dock_block_shorts_info: "Shorts sayfasini Ana sayfaya yonlendirir.",

      dock_lowpop_home_state_on: "Az populer filtre (Home): ACIK",
      dock_lowpop_home_state_off: "Az populer filtre (Home): KAPALI",
      dock_lowpop_home_label: "Az populer videolar (Home)",
      dock_lowpop_home_action_on: "Az populer videolari goster",
      dock_lowpop_home_action_off: "Az populer videolari gizle",
      dock_lowpop_home_info: "Home'da goruntuleme esiginin altindaki videolari gizler.",

      dock_lowpop_watch_state_on: "Az populer filtre (/watch): ACIK",
      dock_lowpop_watch_state_off: "Az populer filtre (/watch): KAPALI",
      dock_lowpop_watch_label: "Az populer oneriler (/watch)",
      dock_lowpop_watch_action_on: "Az populer onerileri goster",
      dock_lowpop_watch_action_off: "Az populer onerileri gizle",
      dock_lowpop_watch_info: "/watch'ta goruntuleme esiginin altindaki onerileri gizler.",
      dock_autolike_subs_label: "Auto-like abonelikler",
      dock_autolike_subs_action_on: "Auto-like devre disi",
      dock_autolike_subs_action_off: "Auto-like etkin",
      dock_autolike_subs_info: "Abone olunan kanallarin videolarini otomatik begenir.",

      dock_lowpop_search_label: "Az populer videolar (Arama)",
      dock_lowpop_search_action_on: "Az populer videolari goster (Arama)",
      dock_lowpop_search_action_off: "Az populer videolari gizle (Arama)",
      dock_lowpop_search_info: "Aramada goruntuleme esiginin altindaki videolari gizler.",

      dock_lowlive_min_label: "Min. canli izleyici",
      dock_lowlive_min_custom: "Ozellestir",
      dock_lowlive_min_prompt: "Canli esik gir (orn. 50, 1k)",
      dock_lowlive_min_invalid: "Gecersiz deger",

      dock_live_home_label: "Livestreamler gizli (Home)",
      dock_live_home_action_on: "Livestreamleri goster (Home)",
      dock_live_home_action_off: "Livestreamleri gizle (Home)",
      dock_live_home_info: "Home'da livestreamleri gizler.",

      dock_live_watch_label: "Livestreamler gizli (/watch)",
      dock_live_watch_action_on: "Livestreamleri goster (/watch)",
      dock_live_watch_action_off: "Livestreamleri gizle (/watch)",
      dock_live_watch_info: "/watch'ta canli onerileri gizler.",

      dock_live_search_label: "Livestreamler gizli (Arama)",
      dock_live_search_action_on: "Livestreamleri goster (Arama)",
      dock_live_search_action_off: "Livestreamleri gizle (Arama)",
      dock_live_search_info: "Aramada livestreamleri gizler.",

      dock_lowlive_home_label: "Az izlenen livestreamler (Home)",
      dock_lowlive_home_action_on: "Az izlenen livestreamleri goster",
      dock_lowlive_home_action_off: "Az izlenen livestreamleri gizle",
      dock_lowlive_home_info: "Home'da izleyici esiginin altindaki livestreamleri gizler.",

      dock_lowlive_watch_label: "Az izlenen livestreamler (/watch)",
      dock_lowlive_watch_action_on: "Az izlenen livestreamleri goster",
      dock_lowlive_watch_action_off: "Az izlenen livestreamleri gizle",
      dock_lowlive_watch_info: "/watch'ta izleyici esiginin altindaki livestreamleri gizler.",

      dock_lowlive_search_label: "Az izlenen livestreamler (Arama)",
      dock_lowlive_search_action_on: "Az izlenen livestreamleri goster",
      dock_lowlive_search_action_off: "Az izlenen livestreamleri gizle",
      dock_lowlive_search_info: "Aramada izleyici esiginin altindaki livestreamleri gizler.",

      dock_header_info: "/watch'ta header icin auto-hide etkinlestirir, hover ile gorunur.",
      dock_float_buttons_label: "Dock gorunur",
      dock_float_buttons_action_on: "Dock'u gizle",
      dock_float_buttons_action_off: "Dock'u goster",
      dock_float_buttons_info: "Yuzen buton dock'unu gosterir veya gizler.",
      dock_menu_home_label: "Home Ozellikleri",
      dock_menu_home_title: "Home Ozellikleri:",
      dock_menu_home_info: "Home ayarlari (Shorts, Haberler, az populer videolar).",
      dock_menu_general_label: "Genel",
      dock_menu_general_title: "Genel:",
      dock_menu_general_info: "Genel kisayollar (Shorts, Canli, filtreler vb.).",
      dock_menu_watch_label: "Video Ozellikleri",
      dock_menu_watch_title: "Video Ozellikleri:",
      dock_menu_watch_info: "Video sayfasi ayarlari (/watch).",
      dock_menu_search_label: "Arama Ozellikleri",
      dock_menu_search_title: "Arama Ozellikleri:",
      dock_menu_search_info: "Arama sonuclari ve raflari icin secenekler.",
      dock_menu_sidebar_label: "Yan Menu Ozellikleri",
      dock_menu_sidebar_title: "Yan Menu Ozellikleri:",
      dock_menu_sidebar_info: "Yan menu giris gorunurlugu.",
      dock_menu_adv_label: "Gelismis",
      dock_menu_adv_title: "Gelismis:",
      dock_menu_adv_info: "Dock icin gelismis secenekler (gorunurluk, vb.).",
      dock_menu_back: "Geri ◀️",

      dock_master_shorts_label: "Shorts'u tamamen kaldir",
      dock_master_shorts_action_on: "Tum Shorts'u goster",
      dock_master_shorts_action_off: "Tum Shorts'u gizle",
      dock_master_shorts_info: "Shorts ile ilgili tum secenekleri etkinlestirir (Home, Arama, Yan menu, Sayfa engeli).",

      dock_master_lowpop_label: "Az populer videolari filtrele",
      dock_master_lowpop_action_on: "Az populer videolari goster",
      dock_master_lowpop_action_off: "Az populer videolari gizle",
      dock_master_lowpop_info: "Home, Arama ve /watch uzerinde low-pop filtresini etkinlestirir.",

      dock_master_news_label: "Haberleri gizle",
      dock_master_news_action_on: "Haberleri goster",
      dock_master_news_action_off: "Haberleri gizle",
      dock_master_news_info: "Home'da Haberler/Top news bolumunu gizler.",

      dock_master_live_label: "Livestreamleri gizle",
      dock_master_live_action_on: "Livestreamleri goster",
      dock_master_live_action_off: "Livestreamleri gizle",
      dock_master_live_info: "Home, Arama ve /watch uzerinde livestream gizlemeyi etkinlestirir.",

      dock_master_lowlive_label: "Az izlenen livestreamleri gizle",
      dock_master_lowlive_action_on: "Az izlenen livestreamleri goster",
      dock_master_lowlive_action_off: "Az izlenen livestreamleri gizle",
      dock_master_lowlive_info: "Home, Arama ve /watch uzerinde dusuk izleyicili live filtresini etkinlestirir.",

      dock_master_header_label: "Header auto-hide (/watch)",
      dock_master_header_action_on: "Header normal",
      dock_master_header_action_off: "Header auto",
      dock_master_header_info: "/watch'ta header auto-hide'i etkinlestirir veya devre disi birakir.",

      dock_mode_state_perf: "Mod: Performans",
      dock_mode_state_eco: "Mod: Tasarruf",
      dock_mode_label: "Eco mod",
      dock_mode_action_perf: "Tasarruf moduna gec",
      dock_mode_action_eco: "Performans moduna gec",
      dock_mode_status_ultra: "Mod: Ultra Tasarruf",
      dock_mode_status_eco: "Mod: Tasarruf",
      dock_mode_status_perf: "Mod: Performans",
      dock_mode_change: "Modu degistir",
      dock_mode_back: "Geri",
      dock_mode_select: "Modunu sec:",
      dock_mode_btn_ultra: "Ultra Tasarruf",
      dock_mode_btn_eco: "Tasarruf",
      dock_mode_btn_perf: "Performans",
      dock_mode_info_ultra: "Ultra Tasarruf:\n- Az populer filtreleri kapatir\n- Header auto-hide kapatir\n- Minimum animasyonlar\n- Daha az otomatik tarama",
      dock_mode_info_eco: "Tasarruf:\n- Bosta taramalar\n- Azaltilmis animasyonlar\n- Standart ozellikler",
      dock_mode_info_perf: "Performans:\n- Gercek zamanli observer'lar\n- Tam animasyonlar\n- Tum ozellikler",

      dock_go_top: "Sayfanin ustune git",
      dock_lang_label: "Dil",
      dock_lang_auto: "Otomatik",

      toast_updated: "Guncellendi",
      toast_reset: "Ayarlar sifirlandi",
      toast_mode_perf: "Mod: Performans",
      toast_mode_eco: "Mod: Kaynak tasarrufu",
      toast_mode_ultra: "Mod: Ultra Tasarruf",
      toast_btn_home_on: "Home filtresi: ACIK (buton)",
      toast_btn_home_off: "Home filtresi: KAPALI (buton)",
      toast_btn_watch_on: "/watch filtresi: ACIK (buton)",
      toast_btn_watch_off: "/watch filtresi: KAPALI (buton)",

      toast_header_on: "Header auto: ACIK (/watch)",
      toast_header_off: "Header auto: KAPALI (/watch)",
    },
  };


  function detectLang() {
    const raw = (document.documentElement.getAttribute("lang") || navigator.language || "en").toLowerCase();
    const short = raw.split("-")[0];
    return I18N[short] ? short : "en";
  }
  let LANG = "en";
  let T = I18N.en;

  /* =========================================================
   * SETTINGS (Unified)
   * ========================================================= */
  const KEY = {
    mode: "ytcf_mode", // "eco" | "perf" | "ultra"
    lang: "ytcf_lang", // "auto" | language code

    shortsHome: "ytcf_shorts_home",
    shortsSearch: "ytcf_shorts_search",
    newsHome: "ytcf_news_home",
    sidebarShorts: "ytcf_sidebar_shorts",
    blockShortsPage: "ytcf_block_shorts_page",

    lowpopHome: "ytcf_lowpop_home",
    lowpopWatch: "ytcf_lowpop_watch",
    lowpopSearch: "ytcf_lowpop_search",
    lowpopMinViews: "ytcf_lowpop_min_views",
    liveHome: "ytcf_live_home",
    liveWatch: "ytcf_live_watch",
    liveSearch: "ytcf_live_search",
    lowpopLiveHome: "ytcf_lowpop_live_home",
    lowpopLiveWatch: "ytcf_lowpop_live_watch",
    lowpopLiveSearch: "ytcf_lowpop_live_search",
    lowpopLiveMinViews: "ytcf_lowpop_live_min_views",

    autoLikeSubs: "ytcf_auto_like_subs",

    floatButtons: "ytcf_float_buttons",
    uiCollapsed: "ytcf_ui_collapsed",
    uiCollapsedWatch: "ytcf_ui_collapsed_watch",

    // ✅ NEW (merged script #2)
    headerHoverWatch: "ytcf_header_hover_watch",
  };

  const DEFAULTS = {
    [KEY.mode]: "eco",
    [KEY.lang]: "auto",

    [KEY.shortsHome]: true,
    [KEY.shortsSearch]: true,
    [KEY.newsHome]: true,
    [KEY.sidebarShorts]: true,
    [KEY.blockShortsPage]: false,

    [KEY.lowpopHome]: false,
    [KEY.lowpopWatch]: true,
    [KEY.lowpopSearch]: false,
    [KEY.lowpopMinViews]: 5000,
    [KEY.liveHome]: false,
    [KEY.liveWatch]: false,
    [KEY.liveSearch]: false,
    [KEY.lowpopLiveHome]: false,
    [KEY.lowpopLiveWatch]: false,
    [KEY.lowpopLiveSearch]: false,
    [KEY.lowpopLiveMinViews]: 100,

    [KEY.autoLikeSubs]: false,

    [KEY.floatButtons]: true,
    [KEY.uiCollapsed]: false,
    [KEY.uiCollapsedWatch]: false,

    // ✅ default OFF
    [KEY.headerHoverWatch]: false,
  };

  function getVal(k) {
    const v = GM_getValue(k);
    return (v === undefined) ? DEFAULTS[k] : v;
  }
  function setVal(k, v) { GM_setValue(k, v); }

  function getBool(k) { return !!getVal(k); }
  function setBool(k, v) { setVal(k, !!v); }

  function getMinViews() {
    const raw = Number(getVal(KEY.lowpopMinViews));
    if (Number.isFinite(raw) && raw > 0) return Math.round(raw);
    return DEFAULTS[KEY.lowpopMinViews];
  }

  function setMinViews(v) {
    const next = Math.max(1, Math.round(Number(v) || 0));
    setVal(KEY.lowpopMinViews, next);
    CONFIG.minViews = next;
  }

  function getMinLiveViews() {
    const raw = Number(getVal(KEY.lowpopLiveMinViews));
    if (Number.isFinite(raw) && raw > 0) return Math.round(raw);
    return DEFAULTS[KEY.lowpopLiveMinViews];
  }

  function setMinLiveViews(v) {
    const next = Math.max(1, Math.round(Number(v) || 0));
    setVal(KEY.lowpopLiveMinViews, next);
    CONFIG.minLiveViews = next;
  }

  function getLangSetting() {
    const v = String(getVal(KEY.lang) || DEFAULTS[KEY.lang]);
    if (v === "auto") return "auto";
    return I18N[v] ? v : "auto";
  }
  function setLangSetting(v) { setVal(KEY.lang, v); }

  const LANG_NATIVE_NAMES = {
    fr: "Français",
    en: "English",
    de: "Deutsch",
    es: "Español",
    it: "Italiano",
    pt: "Português",
    nl: "Nederlands",
    pl: "Polski",
    tr: "Türkçe",
  };

  const LANG_CYCLE = ["auto", ...Object.keys(I18N)];

  function resolveLang() {
    const override = getLangSetting();
    if (override !== "auto" && I18N[override]) return override;
    return detectLang();
  }

  function applyLanguage() {
    LANG = resolveLang();
    T = I18N[LANG] || I18N.en;
  }

  function getLangDisplayName(code) {
    if (code === "auto") return T.dock_lang_auto || "Auto";
    return LANG_NATIVE_NAMES[code] || code.toUpperCase();
  }

  function getCurrentLangLabel() {
    const setting = getLangSetting();
    if (setting === "auto") {
      const autoLabel = getLangDisplayName("auto");
      const activeLabel = LANG_NATIVE_NAMES[LANG] || LANG.toUpperCase();
      return `${autoLabel} (${activeLabel})`;
    }
    return getLangDisplayName(setting);
  }

  function getNextLangCode(cur) {
    const idx = LANG_CYCLE.indexOf(cur);
    if (idx === -1) return LANG_CYCLE[0];
    return LANG_CYCLE[(idx + 1) % LANG_CYCLE.length];
  }
  function getPrevLangCode(cur) {
    const idx = LANG_CYCLE.indexOf(cur);
    if (idx === -1) return LANG_CYCLE[0];
    return LANG_CYCLE[(idx - 1 + LANG_CYCLE.length) % LANG_CYCLE.length];
  }

  applyLanguage();

  function getMode() {
    const v = String(getVal(KEY.mode) || DEFAULTS[KEY.mode]);
    if (v === "perf" || v === "ultra") return v;
    return "eco";
  }
  function setMode(m) {
    if (m === "perf" || m === "ultra") setVal(KEY.mode, m);
    else setVal(KEY.mode, "eco");
  }

  let savedUltraPrefs = null;
  function isUltraMode() {
    return getMode() === "ultra";
  }
  function enterUltraMode() {
    if (!savedUltraPrefs) {
      savedUltraPrefs = {
        lowpopHome: getBool(KEY.lowpopHome),
        lowpopWatch: getBool(KEY.lowpopWatch),
        headerHoverWatch: getBool(KEY.headerHoverWatch),
      };
    }
    setBool(KEY.lowpopHome, false);
    setBool(KEY.lowpopWatch, false);
    setBool(KEY.headerHoverWatch, false);
    headerDisable();
  }
  function exitUltraMode() {
    if (!savedUltraPrefs) return;
    setBool(KEY.lowpopHome, savedUltraPrefs.lowpopHome);
    setBool(KEY.lowpopWatch, savedUltraPrefs.lowpopWatch);
    setBool(KEY.headerHoverWatch, savedUltraPrefs.headerHoverWatch);
    savedUltraPrefs = null;
  }

  let uiCollapsed = !!getVal(KEY.uiCollapsed);
  function setUiCollapsed(v) {
    uiCollapsed = !!v;
    setBool(KEY.uiCollapsed, uiCollapsed);
  }

  let uiCollapsedWatch = !!getVal(KEY.uiCollapsedWatch);
  function setUiCollapsedWatch(v) {
    uiCollapsedWatch = !!v;
    setBool(KEY.uiCollapsedWatch, uiCollapsedWatch);
  }

  /* =========================================================
   * TOAST (Unified)
   * ========================================================= */
  const TOAST_ID = "ytcf-toast";
  const TOAST_THEME = {
    on:   { bg: "#0B1F16", border: "#1F6F4A", text: "#D8F6E8", accent: "#2DD4BF" },
    off:  { bg: "#220D0D", border: "#7F1D1D", text: "#FFE4E6", accent: "#FB7185" },
    info: { bg: "#0B1220", border: "#1E3A8A", text: "#E0E7FF", accent: "#60A5FA" },
    perf: { bg: "#0B1220", border: "#2563EB", text: "#E0E7FF", accent: "#60A5FA" },
    eco:  { bg: "#0B1F16", border: "#16A34A", text: "#D8F6E8", accent: "#22C55E" },
    ultra:{ bg: "#1F1208", border: "#F97316", text: "#FFE9D1", accent: "#FDBA74" },
  };

  function ensureToast() {
    let toast = document.getElementById(TOAST_ID);
    if (!toast) {
      toast = document.createElement("div");
      toast.id = TOAST_ID;
      toast.style.cssText = `
        position: fixed;
        left: 16px;
        bottom: 16px;
        z-index: 2147483647;
        max-width: min(520px, calc(100vw - 32px));
        padding: 10px 12px;
        border-radius: 12px;
        font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        box-shadow: 0 10px 28px rgba(0,0,0,0.35);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        transform: translateY(8px);
        opacity: 0;
        transition: opacity 160ms ease, transform 160ms ease;
        pointer-events: none;
        display: flex;
        gap: 10px;
        align-items: flex-start;
      `;
      const bar = document.createElement("div");
      bar.id = `${TOAST_ID}-bar`;
      bar.style.cssText = `
        width: 4px;
        border-radius: 999px;
        flex: 0 0 4px;
        margin-top: 2px;
        height: 18px;
      `;
      const text = document.createElement("div");
      text.id = `${TOAST_ID}-text`;
      text.style.cssText = `flex: 1 1 auto; white-space: pre-wrap;`;
      toast.appendChild(bar);
      toast.appendChild(text);
      document.documentElement.appendChild(toast);
    }
    const bar = document.getElementById(`${TOAST_ID}-bar`);
    const text = document.getElementById(`${TOAST_ID}-text`);
    return { toast, bar, text };
  }

  function hideToast() {
    const toast = document.getElementById(TOAST_ID);
    if (!toast) return;
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
  }

  function showToast(message, kind = "info", durationMs = 2000) {
    if (!message) return;
    const theme = TOAST_THEME[kind] || TOAST_THEME.info;
    const { toast, bar, text } = ensureToast();

    toast.style.background = theme.bg;
    toast.style.border = `1px solid ${theme.border}`;
    toast.style.color = theme.text;
    bar.style.background = theme.accent;
    text.textContent = message;

    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    void toast.offsetHeight;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    clearTimeout(showToast._t);
    if (durationMs > 0) {
      showToast._t = setTimeout(() => {
        hideToast();
      }, durationMs);
    }
  }

  function showStickyToast(message, kind = "info") {
    showToast(message, kind, 0);
  }

  function statusLabel(on) {
    return `[${on ? T.status_on : T.status_off}]`;
  }

  /* =========================================================
   * ROUTE HELPERS (SPA)
   * ========================================================= */
  function isHome() {
    if (location.pathname !== "/") return false;
    return !!(document.querySelector('ytd-browse[page-subtype="home"]') || document.querySelector("ytd-rich-grid-renderer"));
  }
  function isSearch() {
    return location.pathname === "/results" || !!document.querySelector("ytd-search");
  }
  function isWatch() {
    return location.pathname === "/watch";
  }

  function homeContainer() {
    return (
      document.querySelector('ytd-browse[page-subtype="home"]') ||
      document.querySelector("ytd-rich-grid-renderer") ||
      document
    );
  }
  function searchContainer() {
    return document.querySelector("ytd-search") || document;
  }
  function watchContainer() {
    return document.querySelector("#related") || document;
  }

  /* =========================================================
   * BASIC HELPERS
   * ========================================================= */
  function normalizeBasic(s) {
    return (s || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u00a0\u202f\u2007]/g, " ");
  }
  function hide(el) { if (el) el.style.display = "none"; }

  /* =========================================================
   * AUTO-LIKE (Subscribed Channels)
   * ========================================================= */
  let lastWatchVideoId = null;
  let lastWatchHref = "";
  let autoLikeState = {
    videoId: null,
    attempts: 0,
    lastAttempt: 0,
    lastClickAt: 0,
    pendingLike: false,
    done: false,
    retryTimers: [],
    verifyTimers: [],
    autoLiked: false,
    lastLikePressed: null,
    lastDislikePressed: null,
    observedLikeBtn: null,
    observedDislikeBtn: null,
  };
  const AUTO_LIKE_BLOCK_KEY = "ytcf_auto_like_blocked_v1";
  const AUTO_LIKE_DONE_KEY = "ytcf_auto_like_done_v1";
  const SUBSCRIBED_TOKENS = [
    "subscribed", "abonne", "abonné", "abonne(e)", "abonnierte",
    "suscrito", "suscrito a", "inscrito", "iscritto", "abonniert",
    "geabonneerd", "subskrybowano", "abonelik", "abonelikler"
  ];
  const UNSUBSCRIBED_TOKENS = [
    "subscribe", "s'abonner", "sabonner", "abonnieren", "suscribirse",
    "suscribete", "suscribete", "iscriviti", "inscreva-se", "abonneren",
    "subskrybuj", "abone ol"
  ];
  const UNSUBSCRIBE_TOKENS = [
    "unsubscribe", "desabonner", "désabonner", "abmelden", "annulla",
    "cancelar suscripcion", "cancelar suscripción", "se desinscrever",
    "uitschrijven", "anuluj subskrypcje", "abonelikten cik"
  ];
  const NOTIFICATION_TOKENS = [
    "notification", "notifications", "notificaciones", "benachrichtigungen",
    "notifiche", "notificacoes", "notificações", "meldingen",
    "powiadomienia", "bildirim"
  ];
  const DISLIKE_TOKENS = [
    "dislike", "je n'aime pas", "no me gusta", "non mi piace", "nao gostei",
    "niet leuk", "nicht gefallt", "nie podoba", "begenmedim"
  ];
  const LIKE_TOKENS = [
    "like", "j'aime", "jaime", "me gusta", "mi piace", "gostei", "curtir",
    "gefallt mir", "mag ich", "leuk", "lubie", "begen", "begendim"
  ];

  function getButtonLabel(btn) {
    return [
      btn?.getAttribute?.("aria-label"),
      btn?.getAttribute?.("title"),
      btn?.getAttribute?.("data-title-no-tooltip"),
      btn?.textContent,
    ].filter(Boolean).join(" ");
  }

  function getWatchVideoId() {
    if (!isWatch()) return null;
    const flexyId = document.querySelector("ytd-watch-flexy")?.getAttribute("video-id");
    if (flexyId) return flexyId;
    const metaId = document.querySelector('meta[itemprop="videoId"]')?.getAttribute("content");
    if (metaId) return metaId;
    const initialId = window.ytInitialPlayerResponse?.videoDetails?.videoId;
    if (initialId) return initialId;
    const params = new URLSearchParams(location.search);
    return params.get("v");
  }

  function getAutoLikeBlockMap() {
    const raw = GM_getValue(AUTO_LIKE_BLOCK_KEY);
    if (!raw || typeof raw !== "object") return {};
    return raw;
  }

  function setAutoLikeBlockMap(map) {
    GM_setValue(AUTO_LIKE_BLOCK_KEY, map);
  }

  function isAutoLikeBlocked(videoId) {
    if (!videoId) return false;
    const map = getAutoLikeBlockMap();
    return !!map[videoId];
  }

  function blockAutoLike(videoId) {
    if (!videoId) return;
    const map = getAutoLikeBlockMap();
    if (map[videoId]) return;
    map[videoId] = 1;
    setAutoLikeBlockMap(map);
    scheduleRun(true);
  }

  function getAutoLikeDoneMap() {
    const raw = GM_getValue(AUTO_LIKE_DONE_KEY);
    if (!raw || typeof raw !== "object") return {};
    return raw;
  }

  function setAutoLikeDoneMap(map) {
    GM_setValue(AUTO_LIKE_DONE_KEY, map);
  }

  function isAutoLikeDone(videoId) {
    if (!videoId) return false;
    const map = getAutoLikeDoneMap();
    return !!map[videoId];
  }

  function markAutoLikeDone(videoId) {
    if (!videoId) return;
    const map = getAutoLikeDoneMap();
    map[videoId] = 1;
    setAutoLikeDoneMap(map);
  }

  function unmarkAutoLikeDone(videoId) {
    if (!videoId) return;
    const map = getAutoLikeDoneMap();
    if (!map[videoId]) return;
    delete map[videoId];
    setAutoLikeDoneMap(map);
  }

  function getAutoLikeBlockCount() {
    const map = getAutoLikeBlockMap();
    try {
      return Object.keys(map || {}).length;
    } catch {
      return 0;
    }
  }

  function resetAutoLikeBlocklist() {
    setAutoLikeBlockMap({});
    showToast(T.toast_autolike_blocklist_reset || "Auto-like blocklist reset", "info");
  }

  function clearAutoLikeRetryTimers() {
    if (autoLikeState.retryTimers?.length) {
      autoLikeState.retryTimers.forEach(id => clearTimeout(id));
    }
    autoLikeState.retryTimers = [];
  }

  function clearAutoLikeVerifyTimers() {
    if (autoLikeState.verifyTimers?.length) {
      autoLikeState.verifyTimers.forEach(id => clearTimeout(id));
    }
    autoLikeState.verifyTimers = [];
  }

  function resetAutoLikeState(videoId) {
    clearAutoLikeRetryTimers();
    clearAutoLikeVerifyTimers();
    if (autoLikeObserver) {
      autoLikeObserver.disconnect();
      autoLikeObserver = null;
    }
    stopAutoLikeWatchObserver();
    autoLikeState = {
      videoId,
      attempts: 0,
      lastAttempt: 0,
      lastClickAt: 0,
      pendingLike: false,
      done: false,
      retryTimers: [],
      verifyTimers: [],
      autoLiked: false,
      lastLikePressed: null,
      lastDislikePressed: null,
      observedLikeBtn: null,
      observedDislikeBtn: null,
    };
    removeAutoLikeIndicator();
  }

  function handleWatchVideoChange() {
    if (!getBool(KEY.autoLikeSubs)) return;
    if (!isWatch()) return;
    const vid = getWatchVideoId();
    const href = location.href;
    if (!vid) {
      if (href !== lastWatchHref) {
        lastWatchHref = href;
        resetAutoLikeState(null);
        startAutoLikeWatchObserver();
      }
      return;
    }
    if (vid === lastWatchVideoId) return;
    lastWatchHref = href;
    lastWatchVideoId = vid;
    resetAutoLikeState(vid);
    startAutoLikeWatchObserver();
    autoLikeSubscribedWatch();
    scheduleAutoLikeRetries();
    setTimeout(bindAutoLikeIndicatorObserver, 120);
  }

  function scheduleAutoLikeRetries() {
    if (!getBool(KEY.autoLikeSubs)) return;
    if (isAutoLikeBlocked(getWatchVideoId())) return;
    if (autoLikeState.done) return;
    if (autoLikeState.attempts >= 8) return;
    if (autoLikeState.retryTimers.length) return;

    const delays = [80, 180, 320, 520, 900, 1500, 2400, 3500];
    autoLikeState.retryTimers = delays.map((ms) => setTimeout(() => {
      autoLikeSubscribedWatch();
    }, ms));
  }

  function getSubscribeButton(renderer) {
    if (!renderer) return null;
    const candidates = [
      renderer.querySelector("#subscribe-button-shape button"),
      renderer.querySelector("yt-button-shape#subscribe-button-shape button"),
      renderer.querySelector("yt-button-shape button"),
      renderer.querySelector("tp-yt-paper-button"),
      renderer.querySelector("button"),
    ].filter(Boolean);
    for (const btn of candidates) {
      if (!isNotificationButton(btn)) return btn;
    }
    return null;
  }

  function normalizeForMatch(text) {
    return normalizeBasic(text || "")
      .replace(/[’`´]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  function textHasAny(text, list) {
    const t = normalizeForMatch(text);
    if (!t) return false;
    return list.some(k => t.includes(normalizeForMatch(k)));
  }

  function isNotificationButton(btn) {
    if (!btn) return false;
    const label = [
      btn.getAttribute("aria-label"),
      btn.getAttribute("title"),
      btn.getAttribute("data-title-no-tooltip"),
      btn.textContent,
    ].filter(Boolean).join(" ");
    return textHasAny(label, NOTIFICATION_TOKENS);
  }

  function findNotificationBellButton() {
    const selectors = [
      "ytd-subscription-notification-toggle-button-renderer button",
      "ytd-subscription-notification-toggle-button-renderer-next button",
      "ytd-subscription-notification-toggle-button-view-model button",
      "yt-subscription-notification-toggle-button-view-model button",
      "ytd-subscriptions-notification-toggle-button-renderer button",
      "ytd-notification-toggle-button-renderer button"
    ];
    for (const sel of selectors) {
      const btns = Array.from(document.querySelectorAll(sel));
      for (const btn of btns) {
        const label = [
          btn.getAttribute("aria-label"),
          btn.getAttribute("title"),
          btn.getAttribute("data-title-no-tooltip"),
          btn.textContent,
        ].filter(Boolean).join(" ");
        if (textHasAny(label, NOTIFICATION_TOKENS)) return btn;
      }
    }
    return null;
  }

  function isSubscribedRenderer(renderer) {
    if (!renderer) return false;
    if (renderer.hasAttribute("subscribed")) return true;
    const subAttr =
      renderer.getAttribute?.("is-subscribed") ||
      renderer.getAttribute?.("data-is-subscribed") ||
      renderer.getAttribute?.("subscribed");
    if (subAttr === "" || subAttr === "true") return true;
    const btn = getSubscribeButton(renderer);
    const pressed = btn?.getAttribute?.("aria-pressed");
    if (pressed === "true") return true;
    if (pressed === "false") return false;
    const dataSub = renderer?.__data?.subscribed ?? renderer?.__data?.isSubscribed;
    if (dataSub === true) return true;

    const label = [
      btn?.getAttribute?.("aria-label"),
      btn?.getAttribute?.("title"),
      btn?.getAttribute?.("data-title-no-tooltip"),
      btn?.textContent,
    ].filter(Boolean).join(" ");
    if (textHasAny(label, UNSUBSCRIBED_TOKENS)) return false;
    if (textHasAny(label, SUBSCRIBED_TOKENS)) return true;
    if (textHasAny(label, UNSUBSCRIBE_TOKENS)) return true;
    const rendererText = renderer?.textContent || "";
    if (textHasAny(rendererText, SUBSCRIBED_TOKENS)) return true;
    if (textHasAny(rendererText, UNSUBSCRIBED_TOKENS)) return false;
    return false;
  }

  function isSubscribedOnWatchPage(renderer) {
    const owner = document.querySelector("ytd-video-owner-renderer");
    if (owner) {
      if (owner.hasAttribute("subscribed")) return true;
      const ownerAttr = owner.getAttribute?.("subscribed");
      if (ownerAttr === "" || ownerAttr === "true") return true;
      const ownerData = owner.__data?.subscribed ?? owner.__data?.isSubscribed;
      if (ownerData === true) return true;
    }
    if (renderer && isSubscribedRenderer(renderer)) return true;
    if (findNotificationBellButton()) return true;
    return false;
  }

  function isDislikeButton(btn) {
    if (!btn) return false;
    if (btn.closest?.("ytd-dislike-button-renderer") || btn.closest?.("#dislike-button")) return true;
    const label = getButtonLabel(btn);
    return textHasAny(label, DISLIKE_TOKENS);
  }

  function isLikeButton(btn) {
    if (!btn) return false;
    const label = getButtonLabel(btn);
    if (textHasAny(label, DISLIKE_TOKENS)) return false;
    return textHasAny(label, LIKE_TOKENS);
  }

  const SEGMENTED_LIKE_SELECTOR = [
    "ytd-segmented-like-dislike-button-renderer",
    "yt-segmented-like-dislike-button-renderer",
    "ytd-segmented-like-dislike-button-view-model",
    "yt-segmented-like-dislike-button-view-model",
  ].join(", ");

  function getLikeDislikeButtons() {
    const segmented = document.querySelector(SEGMENTED_LIKE_SELECTOR);
    if (segmented) {
      const btns = Array.from(segmented.querySelectorAll("button[aria-pressed]"));
      if (btns.length) {
        const dislikeBtn = btns.find(isDislikeButton) || null;
        let likeBtn = btns.find(isLikeButton) || null;
        if (!likeBtn) likeBtn = btns.find(btn => btn !== dislikeBtn) || null;
        if (!likeBtn) likeBtn = btns[0] || null;
        let resolvedDislike = dislikeBtn;
        if (!resolvedDislike && btns.length > 1) {
          resolvedDislike = (btns[0] === likeBtn) ? btns[1] : btns[0];
        }
        return { likeBtn, dislikeBtn: resolvedDislike };
      }
    }

    const containers = [
      document.querySelector("#top-level-buttons-computed"),
      document.querySelector("ytd-menu-renderer"),
      document.querySelector("ytd-watch-metadata"),
    ].filter(Boolean);

    for (const container of containers) {
      const btns = Array.from(container.querySelectorAll("button[aria-pressed]"));
      if (!btns.length) continue;
      const dislikeBtn = btns.find(isDislikeButton) || null;
      let likeBtn = btns.find(isLikeButton) || null;
      if (!likeBtn) likeBtn = btns.find(btn => btn !== dislikeBtn) || null;
      if (!likeBtn) likeBtn = btns[0] || null;
      let resolvedDislike = dislikeBtn;
      if (!resolvedDislike && btns.length > 1) {
        resolvedDislike = (btns[0] === likeBtn) ? btns[1] : btns[0];
      }
      return { likeBtn, dislikeBtn: resolvedDislike };
    }

    return { likeBtn: null, dislikeBtn: null };
  }

  function findDislikeButton() {
    const { dislikeBtn } = getLikeDislikeButtons();
    if (dislikeBtn) return dislikeBtn;
    const candidates = [
      "ytd-dislike-button-renderer button",
      "#dislike-button button",
      "ytd-segmented-like-dislike-button-renderer button[aria-pressed]",
      "yt-segmented-like-dislike-button-renderer button[aria-pressed]",
      "ytd-segmented-like-dislike-button-view-model button[aria-pressed]",
      "yt-segmented-like-dislike-button-view-model button[aria-pressed]",
      "#top-level-buttons-computed button[aria-pressed]"
    ];
    for (const sel of candidates) {
      const btns = Array.from(document.querySelectorAll(sel));
      for (const btn of btns) {
        if (isDislikeButton(btn)) return btn;
      }
    }
    return null;
  }

  function findLikeButton() {
    const { likeBtn } = getLikeDislikeButtons();
    if (likeBtn) return likeBtn;
    const candidates = [
      "ytd-like-button-renderer button",
      "#like-button button",
      "ytd-like-button-renderer button[aria-pressed]",
      "ytd-segmented-like-dislike-button-renderer button[aria-pressed]",
      "yt-segmented-like-dislike-button-renderer button[aria-pressed]",
      "ytd-segmented-like-dislike-button-view-model button[aria-pressed]",
      "yt-segmented-like-dislike-button-view-model button[aria-pressed]",
      "ytd-like-button-view-model button",
      "yt-like-button-view-model button",
      "#top-level-buttons-computed ytd-toggle-button-renderer button[aria-pressed]",
      "#top-level-buttons-computed button[aria-pressed]",
      "ytd-toggle-button-renderer#like-button button"
    ];

    for (const sel of candidates) {
      const btns = Array.from(document.querySelectorAll(sel));
      for (const btn of btns) {
        if (isLikeButton(btn)) return btn;
        if (!isDislikeButton(btn)) return btn;
      }
    }
    return null;
  }

  function getPressedState(btn) {
    if (!btn) return null;
    const direct = btn.getAttribute?.("aria-pressed");
    if (direct != null) return direct;
    const parentPressed = btn.closest?.("[aria-pressed]")?.getAttribute?.("aria-pressed");
    if (parentPressed != null) return parentPressed;
    const directChecked = btn.getAttribute?.("aria-checked");
    if (directChecked != null) return directChecked;
    const parentChecked = btn.closest?.("[aria-checked]")?.getAttribute?.("aria-checked");
    if (parentChecked != null) return parentChecked;
    return null;
  }

  const AUTO_LIKE_INDICATOR_ID = "ytcf-auto-like-indicator";
  const AUTO_LIKE_HINT_COOLDOWN = 1200;
  const AUTO_LIKE_VERIFY_CHECKS = [250, 600, 1200, 2000, 3200, 5000];
  const AUTO_LIKE_CONFIRM_WINDOW_MS = 8000;
  let autoLikeIndicatorHintAt = 0;

  function isRecentAutoLikeClick() {
    return !!autoLikeState.lastClickAt && (Date.now() - autoLikeState.lastClickAt) <= AUTO_LIKE_CONFIRM_WINDOW_MS;
  }

  function getAutoLikeIndicatorHintText() {
    return (
      T.toast_autolike_indicator_hint ||
      "Auto-like active. Click to remove the like and block auto-like for this video."
    );
  }

  function getAutoLikeIndicatorClickedText() {
    return (
      T.toast_autolike_indicator_clicked ||
      "Like removed. Auto-like blocked for this video."
    );
  }

  function getAutoLikeIndicatorFailText() {
    return (
      T.toast_autolike_indicator_failed ||
      "Unable to remove the like right now. Please try again."
    );
  }

  function updateAutoLikeIndicatorLabel(el) {
    if (!el) return;
    const hint = getAutoLikeIndicatorHintText();
    el.title = hint;
    el.setAttribute("aria-label", hint);
  }

  function maybeShowAutoLikeIndicatorHint() {
    const now = Date.now();
    if (now - autoLikeIndicatorHintAt < AUTO_LIKE_HINT_COOLDOWN) return;
    autoLikeIndicatorHintAt = now;
    showToast(getAutoLikeIndicatorHintText(), "info");
  }

  function handleAutoLikeIndicatorClick(e) {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
      e.stopImmediatePropagation?.();
    }

    const vid = getWatchVideoId() || autoLikeState.videoId || lastWatchVideoId;
    if (vid) {
      blockAutoLike(vid);
      unmarkAutoLikeDone(vid);
    }

    autoLikeState.done = true;
    autoLikeState.pendingLike = false;
    clearAutoLikeRetryTimers();
    clearAutoLikeVerifyTimers();
    stopAutoLikeWatchObserver();

    if (autoLikeObserver) {
      autoLikeObserver.disconnect();
      autoLikeObserver = null;
    }

    const attemptRemove = (triesLeft) => {
      const likeBtn = findLikeButton();
      const pressed = getPressedState(likeBtn);
      if (!likeBtn || pressed == null) {
        if (triesLeft > 0) {
          setTimeout(() => attemptRemove(triesLeft - 1), 260);
          return;
        }
        autoLikeState.autoLiked = false;
        showToast(getAutoLikeIndicatorFailText(), "off");
        removeAutoLikeIndicator();
        return;
      }

      if (pressed === "true") {
        likeBtn.click();
      }
      autoLikeState.autoLiked = false;
      showToast(getAutoLikeIndicatorClickedText(), "info");
      removeAutoLikeIndicator();
    };

    attemptRemove(6);
  }

  function bindAutoLikeIndicatorEvents(el) {
    if (!el || el.dataset.ytcfAutoLikeBound === "1") return;
    el.dataset.ytcfAutoLikeBound = "1";
    el.style.cursor = "pointer";
    el.style.pointerEvents = "auto";
    el.setAttribute("role", "button");
    el.tabIndex = 0;
    updateAutoLikeIndicatorLabel(el);

    el.addEventListener("mouseenter", maybeShowAutoLikeIndicatorHint, { passive: true });
    el.addEventListener("focus", maybeShowAutoLikeIndicatorHint);
    el.addEventListener("click", handleAutoLikeIndicatorClick);
    el.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        handleAutoLikeIndicatorClick(ev);
      }
    });
  }

  function getActionBarEl() {
    return (
      document.querySelector("#top-level-buttons-computed") ||
      document.querySelector("ytd-segmented-like-dislike-button-renderer") ||
      document.querySelector("ytd-menu-renderer")
    );
  }

  function ensureAutoLikeIndicator() {
    let el = document.getElementById(AUTO_LIKE_INDICATOR_ID);
    if (el) {
      updateAutoLikeIndicatorLabel(el);
      bindAutoLikeIndicatorEvents(el);
      return el;
    }
    el = document.createElement("span");
    el.id = AUTO_LIKE_INDICATOR_ID;
    el.textContent = "🤖";
    el.style.cssText = `
      display: inline-flex;
      align-items: center;
      margin-right: 8px;
      padding: 0 6px;
      height: 28px;
      border-radius: 999px;
      background: rgba(0,0,0,0.55);
      color: #fff;
      font-size: 14px;
      line-height: 1;
      border: 1px solid rgba(255,255,255,0.18);
    `;
    updateAutoLikeIndicatorLabel(el);
    bindAutoLikeIndicatorEvents(el);
    return el;
  }

  function removeAutoLikeIndicator() {
    document.getElementById(AUTO_LIKE_INDICATOR_ID)?.remove();
  }

  function updateAutoLikeIndicator() {
    if (!autoLikeState.autoLiked) {
      removeAutoLikeIndicator();
      return;
    }
    const likeBtn = findLikeButton();
    const dislikeBtn = findDislikeButton();
    const likeOn = getPressedState(likeBtn) === "true";
    const dislikeOn = getPressedState(dislikeBtn) === "true";
    if (!likeOn || dislikeOn) {
      removeAutoLikeIndicator();
      autoLikeState.autoLiked = false;
      return;
    }
    const bar =
      likeBtn?.closest?.("#top-level-buttons-computed") ||
      likeBtn?.closest?.("ytd-segmented-like-dislike-button-renderer")?.parentElement ||
      getActionBarEl();
    if (!bar) return;
    const el = ensureAutoLikeIndicator();
    if (!el.isConnected) {
      const likeGroup =
        likeBtn?.closest?.("ytd-toggle-button-renderer") ||
        likeBtn?.closest?.("ytd-like-button-renderer") ||
        likeBtn?.closest?.("ytd-segmented-like-dislike-button-renderer") ||
        null;
      if (likeGroup?.parentElement) {
        likeGroup.parentElement.insertBefore(el, likeGroup);
      } else {
        bar.insertBefore(el, bar.firstChild || null);
      }
    }
  }

  let autoLikeObserver = null;
  let autoLikeWatchObserver = null;
  let autoLikeWatchObserverTimer = null;
  let autoLikePulseTimer = null;
  let autoLikePulseEnd = 0;
  let watchFlexyObserver = null;
  let watchFlexyEl = null;

  function stopAutoLikeWatchObserver() {
    if (autoLikeWatchObserver) {
      autoLikeWatchObserver.disconnect();
      autoLikeWatchObserver = null;
    }
    if (autoLikeWatchObserverTimer) {
      clearTimeout(autoLikeWatchObserverTimer);
      autoLikeWatchObserverTimer = null;
    }
    if (autoLikePulseTimer) {
      clearInterval(autoLikePulseTimer);
      autoLikePulseTimer = null;
    }
    autoLikePulseEnd = 0;
  }

  function startAutoLikeWatchObserver() {
    if (!getBool(KEY.autoLikeSubs) || !isWatch()) return;
    stopAutoLikeWatchObserver();
    const root =
      document.querySelector("ytd-watch-flexy") ||
      document.querySelector("ytd-app") ||
      document.documentElement;
    if (!root) return;
    autoLikeWatchObserver = new MutationObserver(() => {
      autoLikeSubscribedWatch();
    });
    autoLikeWatchObserver.observe(root, { childList: true, subtree: true });
    autoLikeWatchObserverTimer = setTimeout(stopAutoLikeWatchObserver, 6000);
    autoLikePulseEnd = Date.now() + 6000;
    autoLikePulseTimer = setInterval(() => {
      if (Date.now() > autoLikePulseEnd) {
        stopAutoLikeWatchObserver();
        return;
      }
      handleWatchVideoChange();
      autoLikeSubscribedWatch();
    }, 220);
  }

  function bindWatchVideoIdObserver() {
    if (!getBool(KEY.autoLikeSubs)) {
      if (watchFlexyObserver) {
        watchFlexyObserver.disconnect();
        watchFlexyObserver = null;
      }
      watchFlexyEl = null;
      return;
    }
    if (!isWatch()) {
      if (watchFlexyObserver) {
        watchFlexyObserver.disconnect();
        watchFlexyObserver = null;
      }
      watchFlexyEl = null;
      return;
    }
    const flexy = document.querySelector("ytd-watch-flexy");
    if (!flexy) return;
    if (watchFlexyEl === flexy && watchFlexyObserver) return;
    if (watchFlexyObserver) watchFlexyObserver.disconnect();
    watchFlexyEl = flexy;
    watchFlexyObserver = new MutationObserver(() => {
      handleWatchVideoChange();
    });
    watchFlexyObserver.observe(flexy, { attributes: true, attributeFilter: ["video-id"] });
    handleWatchVideoChange();
  }
  function bindAutoLikeIndicatorObserver() {
    const likeBtn = findLikeButton();
    const dislikeBtn = findDislikeButton();
    const targets = [likeBtn, dislikeBtn].filter(Boolean);
    if (!targets.length) return;
    if (
      autoLikeObserver &&
      autoLikeState.observedLikeBtn === likeBtn &&
      autoLikeState.observedDislikeBtn === dislikeBtn
    ) {
      return;
    }
    if (autoLikeObserver) {
      autoLikeObserver.disconnect();
      autoLikeObserver = null;
    }
    autoLikeState.observedLikeBtn = likeBtn;
    autoLikeState.observedDislikeBtn = dislikeBtn;
    autoLikeState.lastLikePressed = likeBtn?.getAttribute("aria-pressed") || null;
    autoLikeState.lastDislikePressed = dislikeBtn?.getAttribute("aria-pressed") || null;
    autoLikeObserver = new MutationObserver(() => {
      const likeNow = likeBtn?.getAttribute("aria-pressed") || null;
      const dislikeNow = dislikeBtn?.getAttribute("aria-pressed") || null;
      const currentVid = getWatchVideoId() || autoLikeState.videoId;
      if (!isWatch() || !currentVid || currentVid !== autoLikeState.videoId) {
        autoLikeState.lastLikePressed = likeNow;
        autoLikeState.lastDislikePressed = dislikeNow;
        return;
      }

      if (autoLikeState.lastLikePressed === "true" && likeNow === "false") {
        blockAutoLike(autoLikeState.videoId);
        unmarkAutoLikeDone(autoLikeState.videoId);
        autoLikeState.done = true;
        stopAutoLikeWatchObserver();
        clearAutoLikeRetryTimers();
        clearAutoLikeVerifyTimers();
      }
      if (autoLikeState.lastDislikePressed !== "true" && dislikeNow === "true") {
        blockAutoLike(autoLikeState.videoId);
        unmarkAutoLikeDone(autoLikeState.videoId);
        autoLikeState.done = true;
        stopAutoLikeWatchObserver();
        clearAutoLikeRetryTimers();
        clearAutoLikeVerifyTimers();
      }

      autoLikeState.lastLikePressed = likeNow;
      autoLikeState.lastDislikePressed = dislikeNow;
      updateAutoLikeIndicator();
    });
    for (const target of targets) {
      autoLikeObserver.observe(target, { attributes: true, attributeFilter: ["aria-pressed"] });
    }
  }

  function scheduleAutoLikeVerify(vid) {
    if (autoLikeState.verifyTimers.length) return;
    const checks = AUTO_LIKE_VERIFY_CHECKS;
    autoLikeState.verifyTimers = checks.map((ms, idx) => setTimeout(() => {
      if (autoLikeState.videoId !== vid) return;
      const likeBtn = findLikeButton();
      const pressed = likeBtn?.getAttribute("aria-pressed");
      if (pressed === "true") {
        autoLikeState.done = true;
        autoLikeState.autoLiked = true;
        autoLikeState.pendingLike = false;
        markAutoLikeDone(vid);
        updateAutoLikeIndicator();
        bindAutoLikeIndicatorObserver();
        stopAutoLikeWatchObserver();
        clearAutoLikeRetryTimers();
        clearAutoLikeVerifyTimers();
        return;
      }
      if (idx === checks.length - 1) {
        autoLikeState.pendingLike = false;
        clearAutoLikeVerifyTimers();
        scheduleAutoLikeRetries();
      }
    }, ms));
  }

  function autoLikeSubscribedWatch() {
    if (!getBool(KEY.autoLikeSubs)) return;
    const vid = getWatchVideoId();
    if (!vid) return;
    if (isAutoLikeBlocked(vid)) return;
    if (autoLikeState.videoId !== vid) resetAutoLikeState(vid);
    if (autoLikeState.done) {
      if (autoLikeState.autoLiked) {
        updateAutoLikeIndicator();
        bindAutoLikeIndicatorObserver();
      } else {
        removeAutoLikeIndicator();
      }
      return;
    }

    const now = Date.now();
    if (now - autoLikeState.lastAttempt < 120) return;
    autoLikeState.lastAttempt = now;
    if (autoLikeState.attempts >= 8) return;
    if (autoLikeState.pendingLike) {
      scheduleAutoLikeVerify(vid);
      return;
    }

    const renderer = document.querySelector("ytd-subscribe-button-renderer, ytd-subscribe-button-view-model");
    const likeBtn = findLikeButton();
    const likePressedAttr = likeBtn?.getAttribute("aria-pressed");
    const dislikeBtn = findDislikeButton();
    const dislikeOn = dislikeBtn?.getAttribute("aria-pressed") === "true";

    if (likePressedAttr === "true" && isAutoLikeDone(vid) && !dislikeOn) {
      autoLikeState.done = true;
      autoLikeState.autoLiked = true;
      updateAutoLikeIndicator();
      bindAutoLikeIndicatorObserver();
      stopAutoLikeWatchObserver();
      clearAutoLikeRetryTimers();
      clearAutoLikeVerifyTimers();
      return;
    }

    if (!isSubscribedOnWatchPage(renderer)) {
      scheduleAutoLikeRetries();
      return;
    }

    if (!likeBtn) {
      scheduleAutoLikeRetries();
      return;
    }
    if (likePressedAttr == null) {
      scheduleAutoLikeRetries();
      return;
    }
    if (dislikeOn) {
      blockAutoLike(vid);
      unmarkAutoLikeDone(vid);
      autoLikeState.done = true;
      stopAutoLikeWatchObserver();
      return;
    }
    if (likeBtn.disabled || likeBtn.getAttribute("aria-disabled") === "true") {
      scheduleAutoLikeRetries();
      return;
    }

    const pressed = likePressedAttr;
    if (pressed === "true") {
      autoLikeState.done = true;
      autoLikeState.pendingLike = false;
      const recentAutoLike = isRecentAutoLikeClick();
      if (autoLikeState.autoLiked || isAutoLikeDone(vid) || recentAutoLike) {
        autoLikeState.autoLiked = true;
        markAutoLikeDone(vid);
        updateAutoLikeIndicator();
        bindAutoLikeIndicatorObserver();
      } else {
        removeAutoLikeIndicator();
      }
      stopAutoLikeWatchObserver();
      clearAutoLikeRetryTimers();
      clearAutoLikeVerifyTimers();
      return;
    }
    if (likeBtn.disabled) {
      scheduleAutoLikeRetries();
      return;
    }

    autoLikeState.attempts += 1;
    autoLikeState.lastClickAt = Date.now();
    autoLikeState.pendingLike = true;
    likeBtn.click();
    scheduleAutoLikeVerify(vid);
  }

  /* =========================================================
   * Block Shorts Page (redirect)
   * ========================================================= */
  function maybeRedirectShortsPage() {
    if (!getBool(KEY.blockShortsPage)) return;

    const p = location.pathname;
    const isShortsPage =
      p === "/shorts" ||
      p.startsWith("/shorts/") ||
      p === "/feed/shorts" ||
      p.startsWith("/feed/shorts");

    if (isShortsPage) {
      history.replaceState(null, "", "/");
      window.dispatchEvent(new Event("popstate"));
    }
  }

  /* =========================================================
   * Hide Shorts shelves (Home/Search) + Shorts results in Search
   * ========================================================= */
  const SHORTS_LOCKUP_SELECTOR =
    "ytm-shorts-lockup-view-model," +
    "ytm-shorts-lockup-view-model-v2," +
    "ytm-shorts-lockup-view-model-v3," +
    "ytm-shorts-lockup-view-model-v4";

  const SECTION_CONTAINER_SELECTOR =
    "ytd-item-section-renderer," +
    "ytd-rich-section-renderer," +
    "ytd-shelf-renderer," +
    "grid-shelf-view-model," +
    "yt-grid-shelf-view-model";

  const SHORTS_TOKENS = ["shorts", "courts", "short"];

  function textLooksLikeShorts(text) {
    const tt = normalizeBasic(text);
    if (!tt) return false;
    return SHORTS_TOKENS.some(k => tt === normalizeBasic(k) || tt.includes(normalizeBasic(k)));
  }

  function hasManyShortsLinks(node) {
    return node.querySelectorAll('a[href^="/shorts/"], a[href*="/shorts/"]').length >= 3;
  }
  function hasNormalResults(node) {
    return !!node.querySelector("ytd-video-renderer, ytd-rich-item-renderer, ytd-playlist-renderer, ytd-channel-renderer");
  }

  function isPureShortsBlock(block) {
    if (!block) return false;
    const hasLockups = !!block.querySelector(SHORTS_LOCKUP_SELECTOR);
    const manyLinks = hasManyShortsLinks(block);
    if (!hasLockups && !manyLinks) return false;

    const titleEl =
      block.querySelector("yt-section-header-view-model") ||
      block.querySelector(".yt-shelf-header-layout__title") ||
      block.querySelector(".yt-shelf-header-layout__title-row") ||
      block.querySelector("h2, h3, #title, span#title");

    const titleText = titleEl ? (titleEl.textContent || "") : "";
    if (!textLooksLikeShorts(titleText)) return false;
    if (hasNormalResults(block)) return false;
    return true;
  }

  function hideShortsShelvesWithin(root, context /* 'home'|'search' */) {
    if (!root) return;

    root.querySelectorAll("ytd-reel-shelf-renderer").forEach(el => {
      hide(el.closest(SECTION_CONTAINER_SELECTOR) || el);
    });

    root.querySelectorAll(SHORTS_LOCKUP_SELECTOR).forEach(lockup => {
      const block = lockup.closest(SECTION_CONTAINER_SELECTOR);
      if (!block) return;
      if (context === "search") {
        if (isPureShortsBlock(block)) hide(block);
      } else {
        hide(block);
      }
    });

    root.querySelectorAll("yt-section-header-view-model, .yt-shelf-header-layout__title, .yt-shelf-header-layout__title-row").forEach(h => {
      if (!textLooksLikeShorts(h.textContent || "")) return;
      const block = h.closest(SECTION_CONTAINER_SELECTOR);
      if (!block) return;

      if (context === "search") {
        if (isPureShortsBlock(block)) hide(block);
      } else {
        const hasShortsContent = !!block.querySelector(SHORTS_LOCKUP_SELECTOR) || hasManyShortsLinks(block);
        if (hasShortsContent) hide(block);
      }
    });

    root.querySelectorAll(SECTION_CONTAINER_SELECTOR).forEach(block => {
      if (context === "search") {
        if (isPureShortsBlock(block)) hide(block);
      } else {
        const hasShortsContent = !!block.querySelector(SHORTS_LOCKUP_SELECTOR) || hasManyShortsLinks(block);
        const titleEl = block.querySelector(".yt-shelf-header-layout__title, yt-section-header-view-model, h2, h3, #title, span#title");
        const titleText = titleEl ? (titleEl.textContent || "") : "";
        if (hasShortsContent && textLooksLikeShorts(titleText)) hide(block);
      }
    });
  }

  function isShortsVideoRenderer(videoRenderer) {
    if (!videoRenderer) return false;
    if (videoRenderer.querySelector('a[href^="/shorts/"], a[href*="/shorts/"]')) return true;

    const badgeText =
      videoRenderer.querySelector("ytd-badge-supported-renderer")?.textContent ||
      videoRenderer.querySelector(".badge-style-type-simple")?.textContent ||
      videoRenderer.querySelector("span.ytd-thumbnail-overlay-time-status-renderer")?.textContent ||
      "";
    if (normalizeBasic(badgeText).includes("shorts")) return true;

    const metaText = videoRenderer.textContent || "";
    if (normalizeBasic(metaText).includes("#shorts")) return true;

    return false;
  }

  function hideShortsVideoResultsInSearch(searchRoot) {
    if (!searchRoot) return;
    const candidates = searchRoot.querySelectorAll(
      "ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer"
    );

    candidates.forEach(node => {
      const vr = node.matches("ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer")
        ? node
        : node.querySelector("ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer");
      if (isShortsVideoRenderer(vr)) hide(node);
    });
  }

  /* =========================================================
   * Hide News shelf on Home
   * ========================================================= */
  const NEWS_TITLES = [
    "news", "top news", "breaking news",
    "actualites", "actualités", "actus",
    "nachrichten", "top-meldungen", "schlagzeilen",
    "noticias", "titulares", "últimas noticias", "ultimas noticias",
    "notizie", "notizie principali", "ultime notizie",
    "notícias", "principais noticias", "principais notícias",
    "nieuws", "topnieuws", "laatste nieuws",
    "wiadomosci", "najwazniejsze wiadomosci", "najważniejsze wiadomości",
    "haberler", "son dakika", "gundem", "gündem"
  ].map(normalizeBasic);

  function titleLooksLikeNews(title) {
    const tt = normalizeBasic(title);
    if (!tt) return false;
    return NEWS_TITLES.some(k => tt === k || tt.includes(k));
  }

  function hideNewsShelfOnHome(root) {
    if (!root) return;
    root.querySelectorAll("ytd-item-section-renderer, ytd-rich-section-renderer, ytd-shelf-renderer").forEach(section => {
      const titleEl = section.querySelector("#title") || section.querySelector("h2, h3") || section.querySelector("span#title");
      const titleText = titleEl?.textContent || "";
      if (titleLooksLikeNews(titleText)) hide(section);
    });
  }

  /* =========================================================
   * Hide Sidebar Shorts entry
   * ========================================================= */
  function isShortsLabelText(txt) {
    const s = normalizeBasic(txt);
    if (!s) return false;
    return s === "shorts" || s.includes("shorts") || s === "courts" || s.includes("courts");
  }

  function hideSidebarShortsEntry() {
    document.querySelectorAll("ytd-mini-guide-entry-renderer").forEach(item => {
      const title = item.querySelector("span.title")?.textContent || "";
      const tooltip = item.querySelector("tp-yt-paper-tooltip #tooltip")?.textContent || "";
      const aria = (item.getAttribute("aria-label") || "") + " " + (item.getAttribute("title") || "");
      if (isShortsLabelText(title) || isShortsLabelText(tooltip) || isShortsLabelText(aria)) hide(item);
    });

    document.querySelectorAll("ytd-guide-entry-renderer, ytd-guide-collapsible-entry-renderer").forEach(item => {
      const title =
        item.querySelector("#title")?.textContent ||
        item.querySelector(".title")?.textContent ||
        item.textContent ||
        "";
      const a = item.querySelector("a#endpoint, a[href]");
      const href = a?.getAttribute?.("href") || "";

      const aria =
        (a?.getAttribute?.("aria-label") || "") + " " +
        (a?.getAttribute?.("title") || "") + " " +
        (item.getAttribute("aria-label") || "") + " " +
        (item.getAttribute("title") || "");

      const looksLikeShorts = isShortsLabelText(title) || isShortsLabelText(aria) || href.includes("shorts");
      if (looksLikeShorts) hide(item);
    });
  }

  /* =========================================================
   * Low-popularity filter (Home + Watch)
   * ========================================================= */
  const CONFIG = { minViews: getMinViews(), minLiveViews: getMinLiveViews() };

  const WORDS = {
    fr: { views: ["vue", "vues"], live: ["spectateur", "spectateurs"] },
    en: { views: ["view", "views"], live: ["viewer", "viewers", "watching"] },
    de: { views: ["aufruf", "aufrufe", "aufrufen"], live: ["zuschauer"] },
    es: { views: ["vista", "vistas", "visualiz", "visualización", "visualizaciones"], live: ["espectador", "espectadores"] },
    it: { views: ["visualizzazione", "visualizzazioni"], live: ["spettatore", "spettatori"] },
    pt: { views: ["visualizacao", "visualizacoes", "visualização", "visualizações"], live: ["espectador", "espectadores"] },
    nl: { views: ["weergave", "weergaven"], live: ["kijker", "kijkers"] },
    pl: { views: ["wyświetlenie", "wyświetlenia", "wyświetleń", "wyswietlenie", "wyswietlenia", "wyswietlen"], live: ["widz", "widzów", "widzowie", "widzow"] },
    tr: { views: ["goruntuleme", "goruntulenme", "görüntüleme", "görüntülenme"], live: ["izleyici"] },
  };

  const NO_VIEWS = {
    fr: ["aucune vue", "aucun vue", "0 vue", "0 vues"],
    en: ["no views", "0 views", "0 view"],
    de: ["keine aufrufe", "0 aufrufe", "0 aufruf"],
    es: ["sin visualizaciones", "sin vistas", "0 vistas", "0 visualizaciones", "0 vista", "0 visualización"],
    it: ["nessuna visualizzazione", "0 visualizzazioni", "0 visualizzazione"],
    pt: ["nenhuma visualizacao", "nenhuma visualização", "sem visualizacoes", "sem visualizações", "0 visualizacoes", "0 visualizações", "0 visualizacao", "0 visualização"],
    nl: ["geen weergaven", "0 weergaven", "0 weergave"],
    pl: ["brak wyswietlen", "brak wyświetleń", "0 wyswietlen", "0 wyświetleń", "0 wyswietlenia", "0 wyświetlenia"],
    tr: ["goruntuleme yok", "görüntüleme yok", "0 goruntuleme", "0 görüntüleme", "0 goruntulenme", "0 görüntülenme"],
  };

  function normalizeMetric(text) {
    return (text || "").toLowerCase().replace(/[\u00a0\u202f\u2007]/g, " ").trim();
  }
  function hasAnyKeyword(t, list) { for (const w of list) if (t.includes(w)) return true; return false; }
  function isNoViewsText(t) { const list = NO_VIEWS[LANG] || NO_VIEWS.en; for (const s of list) if (t.includes(s)) return true; return false; }

  function parseNumberWithSuffix(t) {
    let mult = 1;
    if (t.includes("k")) mult = 1e3;
    if (t.includes("m")) mult = 1e6;
    if (t.includes("b")) mult = 1e9;
    const num = parseFloat(t.replace(/[^\d.,]/g, "").replace(",", "."));
    if (Number.isNaN(num)) return null;
    return Math.round(num * mult);
  }

  function parseViewsOrLive(text) {
    if (!text) return null;
    const t = normalizeMetric(text);
    if (isNoViewsText(t)) return 0;

    const dict = WORDS[LANG] || WORDS.en;
    const keys = [...(dict.views || []), ...(dict.live || [])];
    if (!hasAnyKeyword(t, keys)) return null;

    return parseNumberWithSuffix(t);
  }

  function parseLiveViewerCount(text) {
    if (!text) return null;
    const t = normalizeMetric(text);
    const dict = WORDS[LANG] || WORDS.en;
    const liveKeys = (dict.live || []);
    if (!hasAnyKeyword(t, liveKeys)) return null;
    return parseNumberWithSuffix(t);
  }

  function getViewCountFromNode(node) {
    if (!node || node.nodeType !== 1) return null;

    const candidates = node.querySelectorAll(
      [
        "span.yt-content-metadata-view-model__metadata-text",
        "#metadata-line span",
        "span.inline-metadata-item",
        "ytd-video-meta-block span",
        "span",
      ].join(", ")
    );

    for (const span of candidates) {
      const count = parseViewsOrLive(span.textContent);
      if (count != null) return count;
    }

    const aria = node.getAttribute?.("aria-label") || "";
    if (aria) {
      const count = parseViewsOrLive(aria);
      if (count != null) return count;
    }

    return null;
  }

  function getLiveViewerCountFromNode(node) {
    if (!node || node.nodeType !== 1) return null;

    const candidates = node.querySelectorAll(
      [
        "span.yt-content-metadata-view-model__metadata-text",
        "#metadata-line span",
        "span.inline-metadata-item",
        "ytd-video-meta-block span",
        "span",
      ].join(", ")
    );

    for (const span of candidates) {
      const count = parseLiveViewerCount(span.textContent);
      if (count != null) return count;
    }

    const aria = node.getAttribute?.("aria-label") || "";
    if (aria) {
      const count = parseLiveViewerCount(aria);
      if (count != null) return count;
    }

    return null;
  }

  const LIVE_BADGE_TOKENS = [
    "live",
    "en direct",
    "en vivo",
    "directo",
    "ao vivo",
    "diretta",
    "na zywo",
    "canli",
  ].map(normalizeBasic);

  function looksLikeLiveBadge(text) {
    const tt = normalizeBasic(text);
    if (!tt) return false;
    return LIVE_BADGE_TOKENS.some(k => tt.includes(k));
  }

  function isLiveItem(node) {
    if (!node || node.nodeType !== 1) return false;
    const badgeText = [
      node.querySelector("ytd-badge-supported-renderer")?.textContent,
      node.querySelector(".badge-style-type-live-now")?.textContent,
      node.querySelector(".badge-style-type-simple")?.textContent,
      node.querySelector("span.ytd-thumbnail-overlay-time-status-renderer")?.textContent,
      node.querySelector("ytd-thumbnail-overlay-time-status-renderer")?.textContent,
    ].filter(Boolean).join(" ");
    return looksLikeLiveBadge(badgeText);
  }

  function processHomeItem(item) {
    if (!getBool(KEY.lowpopHome)) return;
    if (!item || item.nodeType !== 1) return;
    if (item.dataset.ytcfLowpopDone === "1") return;

    const count = getViewCountFromNode(item);
    if (count != null) {
      item.dataset.ytcfLowpopDone = "1";
      if (count < CONFIG.minViews) {
        item.style.display = "none";
        item.dataset.ytcfLowpopHidden = "1";
      }
    }
  }

  function scanHomeLowpop(root) {
    if (!getBool(KEY.lowpopHome)) return;
    const base = root && root.querySelectorAll ? root : document;
    base.querySelectorAll("ytd-rich-item-renderer").forEach(processHomeItem);
    if (root && root.matches && root.matches("ytd-rich-item-renderer")) processHomeItem(root);
  }

  function processHomeLiveItem(item) {
    if (!getBool(KEY.liveHome)) return;
    if (!item || item.nodeType !== 1) return;
    if (item.dataset.ytcfLiveDone === "1") return;
    if (!isLiveItem(item)) return;
    item.dataset.ytcfLiveDone = "1";
    item.style.display = "none";
    item.dataset.ytcfLiveHidden = "1";
  }

  function scanHomeLive(root) {
    if (!getBool(KEY.liveHome)) return;
    const base = root && root.querySelectorAll ? root : document;
    base.querySelectorAll("ytd-rich-item-renderer").forEach(processHomeLiveItem);
    if (root && root.matches && root.matches("ytd-rich-item-renderer")) processHomeLiveItem(root);
  }

  function processHomeLowLiveItem(item) {
    if (!getBool(KEY.lowpopLiveHome)) return;
    if (!item || item.nodeType !== 1) return;
    if (item.dataset.ytcfLowliveDone === "1") return;
    if (!isLiveItem(item)) return;
    const count = getLiveViewerCountFromNode(item);
    if (count != null) {
      item.dataset.ytcfLowliveDone = "1";
      if (count < CONFIG.minLiveViews) {
        item.style.display = "none";
        item.dataset.ytcfLowliveHidden = "1";
      }
    }
  }

  function scanHomeLowLive(root) {
    if (!getBool(KEY.lowpopLiveHome)) return;
    const base = root && root.querySelectorAll ? root : document;
    base.querySelectorAll("ytd-rich-item-renderer").forEach(processHomeLowLiveItem);
    if (root && root.matches && root.matches("ytd-rich-item-renderer")) processHomeLowLiveItem(root);
  }

  function processWatchCard(card) {
    if (!getBool(KEY.lowpopWatch)) return;
    if (!card || card.nodeType !== 1) return;
    if (card.dataset.ytcfLowpopDone === "1") return;

    const count = getViewCountFromNode(card);
    if (count != null) {
      card.dataset.ytcfLowpopDone = "1";
      if (count < CONFIG.minViews) {
        card.style.display = "none";
        card.dataset.ytcfLowpopHidden = "1";
      }
    }
  }

  function scanWatchLowpop(root) {
    if (!getBool(KEY.lowpopWatch)) return;
    const base = root && root.querySelectorAll ? root : document;
    base.querySelectorAll(
      [
        "div.yt-lockup-view-model",
        "ytd-compact-video-renderer",
        "ytd-video-renderer",
        "ytd-grid-video-renderer",
        "ytd-rich-item-renderer",
      ].join(", ")
    ).forEach(processWatchCard);
    if (
      root &&
      root.matches &&
      root.matches(
        [
          "div.yt-lockup-view-model",
          "ytd-compact-video-renderer",
          "ytd-video-renderer",
          "ytd-grid-video-renderer",
          "ytd-rich-item-renderer",
        ].join(", ")
      )
    ) {
      processWatchCard(root);
    }
  }

  function processSearchItem(item) {
    if (!getBool(KEY.lowpopSearch)) return;
    if (!item || item.nodeType !== 1) return;
    if (item.dataset.ytcfLowpopDone === "1") return;

    const count = getViewCountFromNode(item);
    if (count != null) {
      item.dataset.ytcfLowpopDone = "1";
      if (count < CONFIG.minViews) {
        item.style.display = "none";
        item.dataset.ytcfLowpopHidden = "1";
      }
    }
  }

  function processWatchLiveCard(card) {
    if (!getBool(KEY.liveWatch)) return;
    if (!card || card.nodeType !== 1) return;
    if (card.dataset.ytcfLiveDone === "1") return;
    if (!isLiveItem(card)) return;
    card.dataset.ytcfLiveDone = "1";
    card.style.display = "none";
    card.dataset.ytcfLiveHidden = "1";
  }

  function scanWatchLive(root) {
    if (!getBool(KEY.liveWatch)) return;
    const base = root && root.querySelectorAll ? root : document;
    base.querySelectorAll(
      [
        "div.yt-lockup-view-model",
        "ytd-compact-video-renderer",
        "ytd-video-renderer",
        "ytd-grid-video-renderer",
        "ytd-rich-item-renderer",
      ].join(", ")
    ).forEach(processWatchLiveCard);
    if (
      root &&
      root.matches &&
      root.matches(
        [
          "div.yt-lockup-view-model",
          "ytd-compact-video-renderer",
          "ytd-video-renderer",
          "ytd-grid-video-renderer",
          "ytd-rich-item-renderer",
        ].join(", ")
      )
    ) {
      processWatchLiveCard(root);
    }
  }

  function processWatchLowLiveCard(card) {
    if (!getBool(KEY.lowpopLiveWatch)) return;
    if (!card || card.nodeType !== 1) return;
    if (card.dataset.ytcfLowliveDone === "1") return;
    if (!isLiveItem(card)) return;
    const count = getLiveViewerCountFromNode(card);
    if (count != null) {
      card.dataset.ytcfLowliveDone = "1";
      if (count < CONFIG.minLiveViews) {
        card.style.display = "none";
        card.dataset.ytcfLowliveHidden = "1";
      }
    }
  }

  function scanWatchLowLive(root) {
    if (!getBool(KEY.lowpopLiveWatch)) return;
    const base = root && root.querySelectorAll ? root : document;
    base.querySelectorAll(
      [
        "div.yt-lockup-view-model",
        "ytd-compact-video-renderer",
        "ytd-video-renderer",
        "ytd-grid-video-renderer",
        "ytd-rich-item-renderer",
      ].join(", ")
    ).forEach(processWatchLowLiveCard);
    if (
      root &&
      root.matches &&
      root.matches(
        [
          "div.yt-lockup-view-model",
          "ytd-compact-video-renderer",
          "ytd-video-renderer",
          "ytd-grid-video-renderer",
          "ytd-rich-item-renderer",
        ].join(", ")
      )
    ) {
      processWatchLowLiveCard(root);
    }
  }

  function scanSearchLowpop(root) {
    if (!getBool(KEY.lowpopSearch)) return;
    const base = root && root.querySelectorAll ? root : document;
    const candidates = base.querySelectorAll(
      "ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer"
    );
    candidates.forEach(processSearchItem);
    if (
      root &&
      root.matches &&
      root.matches("ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer")
    ) {
      processSearchItem(root);
    }
  }

  function processSearchLiveItem(item) {
    if (!getBool(KEY.liveSearch)) return;
    if (!item || item.nodeType !== 1) return;
    if (item.dataset.ytcfLiveDone === "1") return;
    if (!isLiveItem(item)) return;
    item.dataset.ytcfLiveDone = "1";
    item.style.display = "none";
    item.dataset.ytcfLiveHidden = "1";
  }

  function scanSearchLive(root) {
    if (!getBool(KEY.liveSearch)) return;
    const base = root && root.querySelectorAll ? root : document;
    const candidates = base.querySelectorAll(
      "ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer"
    );
    candidates.forEach(processSearchLiveItem);
    if (
      root &&
      root.matches &&
      root.matches("ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer")
    ) {
      processSearchLiveItem(root);
    }
  }

  function processSearchLowLiveItem(item) {
    if (!getBool(KEY.lowpopLiveSearch)) return;
    if (!item || item.nodeType !== 1) return;
    if (item.dataset.ytcfLowliveDone === "1") return;
    if (!isLiveItem(item)) return;
    const count = getLiveViewerCountFromNode(item);
    if (count != null) {
      item.dataset.ytcfLowliveDone = "1";
      if (count < CONFIG.minLiveViews) {
        item.style.display = "none";
        item.dataset.ytcfLowliveHidden = "1";
      }
    }
  }

  function scanSearchLowLive(root) {
    if (!getBool(KEY.lowpopLiveSearch)) return;
    const base = root && root.querySelectorAll ? root : document;
    const candidates = base.querySelectorAll(
      "ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer"
    );
    candidates.forEach(processSearchLowLiveItem);
    if (
      root &&
      root.matches &&
      root.matches("ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer")
    ) {
      processSearchLowLiveItem(root);
    }
  }

  function unhideLowpop() {
    document.querySelectorAll("ytd-rich-item-renderer[data-ytcf-lowpop-hidden='1'], ytd-rich-item-renderer[data-ytcfLowpopHidden='1']").forEach(v => {
      v.style.display = "";
      v.removeAttribute("data-ytcf-lowpop-hidden");
      v.removeAttribute("data-ytcfLowpopHidden");
      v.removeAttribute("data-ytcf-lowpop-done");
      v.removeAttribute("data-ytcfLowpopDone");
    });
    document.querySelectorAll("ytd-video-renderer[data-ytcf-lowpop-hidden='1'], ytd-video-renderer[data-ytcfLowpopHidden='1'], ytd-compact-video-renderer[data-ytcf-lowpop-hidden='1'], ytd-compact-video-renderer[data-ytcfLowpopHidden='1'], ytd-grid-video-renderer[data-ytcf-lowpop-hidden='1'], ytd-grid-video-renderer[data-ytcfLowpopHidden='1'], ytd-rich-item-renderer[data-ytcf-lowpop-hidden='1'], ytd-rich-item-renderer[data-ytcfLowpopHidden='1']").forEach(v => {
      v.style.display = "";
      v.removeAttribute("data-ytcf-lowpop-hidden");
      v.removeAttribute("data-ytcfLowpopHidden");
      v.removeAttribute("data-ytcf-lowpop-done");
      v.removeAttribute("data-ytcfLowpopDone");
    });
    document.querySelectorAll("div.yt-lockup-view-model[data-ytcfLowpopHidden='1'], div.yt-lockup-view-model[data-ytcf-lowpop-hidden='1']").forEach(c => {
      c.style.display = "";
      c.removeAttribute("data-ytcfLowpopHidden");
      c.removeAttribute("data-ytcf-lowpop-hidden");
      c.removeAttribute("data-ytcf-lowpop-done");
      c.removeAttribute("data-ytcfLowpopDone");
    });
    document.querySelectorAll("ytd-video-renderer[data-ytcfLowpopDone='1'], ytd-compact-video-renderer[data-ytcfLowpopDone='1'], ytd-grid-video-renderer[data-ytcfLowpopDone='1'], ytd-rich-item-renderer[data-ytcfLowpopDone='1'], div.yt-lockup-view-model[data-ytcfLowpopDone='1']").forEach(el => {
      el.removeAttribute("data-ytcf-lowpop-done");
      el.removeAttribute("data-ytcfLowpopDone");
    });
  }

  function unhideLive() {
    document.querySelectorAll(
      [
        "ytd-rich-item-renderer[data-ytcf-live-hidden='1']",
        "ytd-video-renderer[data-ytcf-live-hidden='1']",
        "ytd-compact-video-renderer[data-ytcf-live-hidden='1']",
        "ytd-grid-video-renderer[data-ytcf-live-hidden='1']",
        "div.yt-lockup-view-model[data-ytcf-live-hidden='1']",
      ].join(", ")
    ).forEach(el => {
      el.style.display = "";
      el.removeAttribute("data-ytcf-live-hidden");
      el.removeAttribute("data-ytcf-live-done");
      el.removeAttribute("data-ytcfLiveHidden");
      el.removeAttribute("data-ytcfLiveDone");
    });
  }

  function unhideLowLive() {
    document.querySelectorAll(
      [
        "ytd-rich-item-renderer[data-ytcf-lowlive-hidden='1']",
        "ytd-video-renderer[data-ytcf-lowlive-hidden='1']",
        "ytd-compact-video-renderer[data-ytcf-lowlive-hidden='1']",
        "ytd-grid-video-renderer[data-ytcf-lowlive-hidden='1']",
        "div.yt-lockup-view-model[data-ytcf-lowlive-hidden='1']",
      ].join(", ")
    ).forEach(el => {
      el.style.display = "";
      el.removeAttribute("data-ytcf-lowlive-hidden");
      el.removeAttribute("data-ytcf-lowlive-done");
      el.removeAttribute("data-ytcfLowliveHidden");
      el.removeAttribute("data-ytcfLowliveDone");
    });
  }

  function resetLowpopProcessed() {
    document.querySelectorAll(
      [
        "ytd-rich-item-renderer[data-ytcf-lowpop-done='1']",
        "ytd-video-renderer[data-ytcf-lowpop-done='1']",
        "ytd-compact-video-renderer[data-ytcf-lowpop-done='1']",
        "ytd-grid-video-renderer[data-ytcf-lowpop-done='1']",
        "div.yt-lockup-view-model[data-ytcf-lowpop-done='1']",
      ].join(", ")
    ).forEach(el => {
      el.removeAttribute("data-ytcf-lowpop-done");
      el.removeAttribute("data-ytcfLowpopDone");
    });
  }

  function resetLiveProcessed() {
    document.querySelectorAll(
      [
        "ytd-rich-item-renderer[data-ytcf-live-done='1']",
        "ytd-video-renderer[data-ytcf-live-done='1']",
        "ytd-compact-video-renderer[data-ytcf-live-done='1']",
        "ytd-grid-video-renderer[data-ytcf-live-done='1']",
        "div.yt-lockup-view-model[data-ytcf-live-done='1']",
      ].join(", ")
    ).forEach(el => {
      el.removeAttribute("data-ytcf-live-done");
      el.removeAttribute("data-ytcfLiveDone");
    });
  }

  function resetLowLiveProcessed() {
    document.querySelectorAll(
      [
        "ytd-rich-item-renderer[data-ytcf-lowlive-done='1']",
        "ytd-video-renderer[data-ytcf-lowlive-done='1']",
        "ytd-compact-video-renderer[data-ytcf-lowlive-done='1']",
        "ytd-grid-video-renderer[data-ytcf-lowlive-done='1']",
        "div.yt-lockup-view-model[data-ytcf-lowlive-done='1']",
      ].join(", ")
    ).forEach(el => {
      el.removeAttribute("data-ytcf-lowlive-done");
      el.removeAttribute("data-ytcfLowliveDone");
    });
  }

  /* =========================================================
   * MODE SCHEDULING (Eco vs Perf)
   * ========================================================= */
  function scheduleIdle(fn, timeoutMs) {
    if (typeof requestIdleCallback === "function") return requestIdleCallback(fn, { timeout: timeoutMs || 500 });
    return setTimeout(() => fn({ timeRemaining: () => 0, didTimeout: true }), timeoutMs || 0);
  }
  function cancelIdle(id) {
    if (typeof cancelIdleCallback === "function") cancelIdleCallback(id);
    else clearTimeout(id);
  }

  let ecoQueue = [];
  let ecoIdleId = null;

  function ecoEnqueue(node, worker) {
    ecoQueue.push([node, worker]);
    if (ecoIdleId != null) return;

    ecoIdleId = scheduleIdle(() => {
      ecoIdleId = null;
      const batch = ecoQueue;
      ecoQueue = [];

      const max = 80;
      let count = 0;
      for (const [n, w] of batch) {
        w(n);
        count++;
        if (count >= max) break;
      }

      if (batch.length > max) {
        ecoQueue = batch.slice(max).concat(ecoQueue);
        ecoIdleId = scheduleIdle(() => {
          ecoIdleId = null;
          const b2 = ecoQueue;
          ecoQueue = [];
          for (const [n, w] of b2) w(n);
        }, 600);
      }
    }, 600);
  }

  function resetEcoQueue() {
    if (ecoIdleId != null) cancelIdle(ecoIdleId);
    ecoIdleId = null;
    ecoQueue = [];
  }

  /* =========================================================
   * HEADER AUTO-HIDE (watch only) — merged script #2
   * ========================================================= */
  const YT_HDR_STYLE_ID = "ytcf-hover-masthead-style";
  const YT_HDR_CLASS = "__ytcfHoverMasthead";
  const YT_HDR_SHOW_ZONE = 60;
  const YT_HDR_HIDE_DELAY = 1200;
  const YT_HDR_SEARCH_GRACE_MS = 1500;

  let headerHoverEnabled = false;
  let headerPinned = false;
  let headerHideTimer = null;
  let searchActiveUntil = 0;
  let searchSuggestObserver = null;
  let searchSuggestEl = null;
  let searchBoxEl = null;
  let searchInputEl = null;
  let headerPinRaf = 0;

  function ensureHeaderStyle() {
    if (document.getElementById(YT_HDR_STYLE_ID)) return;

    const css = `
      ytd-masthead.${YT_HDR_CLASS} {
        background: linear-gradient(
          to bottom,
          rgba(0,0,0,0.92) 0%,
          rgba(0,0,0,0.88) 60%,
          rgba(0,0,0,0.75) 85%,
          rgba(0,0,0,0.0) 100%
        ) !important;

        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);

        box-shadow:
          0 2px 8px rgba(0,0,0,0.6),
          0 12px 24px rgba(0,0,0,0.35) !important;
      }

      ytd-masthead.${YT_HDR_CLASS} #container,
      ytd-masthead.${YT_HDR_CLASS} #background,
      ytd-masthead.${YT_HDR_CLASS} .ytd-masthead {
        background: transparent !important;
      }
    `;

    const style = document.createElement("style");
    style.id = YT_HDR_STYLE_ID;
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  let headerEl = null;
  function getHeaderEl() {
    if (!headerEl || !headerEl.isConnected) {
      headerEl = document.querySelector("ytd-masthead");
    }
    return headerEl;
  }

  function setHeaderVisible(header, visible) {
    if (!header) return;
    header.style.transform = visible ? "translateY(0)" : "translateY(-100%)";
    header.style.pointerEvents = visible ? "auto" : "none";
  }

  function headerEnable() {
    const header = getHeaderEl();
    const app = document.querySelector("ytd-app");
    if (!header || !app) return;

    ensureHeaderStyle();

    header.classList.add(YT_HDR_CLASS);

    header.style.position = "fixed";
    header.style.top = "0";
    header.style.left = "0";
    header.style.right = "0";
    header.style.zIndex = "9999";
    header.style.transition = "transform 0.25s ease";
    setHeaderVisible(header, false);

    app.style.setProperty("--ytd-masthead-height", "0px");
    app.style.paddingTop = "0px";

    const pageManager = document.querySelector("ytd-page-manager");
    if (pageManager) pageManager.style.marginTop = "0px";

    headerHoverEnabled = true;
    bindSearchSuggestionsObserver();
  }

  function headerDisable() {
    const header = getHeaderEl();
    const app = document.querySelector("ytd-app");
    const pageManager = document.querySelector("ytd-page-manager");

    if (headerHideTimer) {
      clearTimeout(headerHideTimer);
      headerHideTimer = null;
    }
    if (headerPinRaf) {
      cancelAnimationFrame(headerPinRaf);
      headerPinRaf = 0;
    }
    searchActiveUntil = 0;
    unbindSearchSuggestionsObserver();
    headerPinned = false;

    if (header) {
      header.style.pointerEvents = "";
      header.classList.remove(YT_HDR_CLASS);
      header.style.position = "";
      header.style.top = "";
      header.style.left = "";
      header.style.right = "";
      header.style.zIndex = "";
      header.style.transition = "";
      header.style.transform = "";
    }

    if (app) {
      app.style.removeProperty("--ytd-masthead-height");
      app.style.paddingTop = "";
    }

    if (pageManager) {
      pageManager.style.marginTop = "";
    }

    headerHoverEnabled = false;
  }

  function applyHeaderHoverNow() {
    if (isUltraMode()) {
      if (headerHoverEnabled) headerDisable();
      return;
    }
    const want = isWatch() && getBool(KEY.headerHoverWatch);
    if (want) headerEnable();
    else headerDisable();
    updateHeaderPinnedFromSearch();
  }

  function getActiveElementDeep(root) {
    let active = root.activeElement;
    while (active && active.shadowRoot && active.shadowRoot.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    return active;
  }

  function getSearchBox() {
    if (!searchBoxEl || !searchBoxEl.isConnected) {
      searchBoxEl = document.querySelector("ytd-searchbox");
    }
    return searchBoxEl;
  }

  function getSearchInput() {
    if (!searchInputEl || !searchInputEl.isConnected) {
      const box = getSearchBox();
      searchInputEl =
        box?.querySelector("input#search") ||
        box?.querySelector("input") ||
        document.querySelector("ytd-searchbox input#search") ||
        document.querySelector("ytd-searchbox input");
    }
    return searchInputEl;
  }

  function getSearchSuggestionsElement() {
    if (searchSuggestEl && searchSuggestEl.isConnected) return searchSuggestEl;
    const box = getSearchBox();
    searchSuggestEl =
      box?.shadowRoot?.querySelector("ytd-searchbox-suggestions") ||
      document.querySelector("ytd-searchbox-suggestions");
    return searchSuggestEl;
  }

  function isSearchSuggestionsOpen() {
    const el = getSearchSuggestionsElement();
    if (!el) return false;
    if (el.hasAttribute("hidden")) return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    if (el.style.display === "none" || el.style.visibility === "hidden") return false;
    const inlineStyle = (el.getAttribute("style") || "").toLowerCase();
    if (inlineStyle.includes("display: none") || inlineStyle.includes("visibility: hidden")) return false;
    if (el.hasAttribute("open")) return true;
    return true;
  }

  function bumpSearchActive() {
    searchActiveUntil = Date.now() + YT_HDR_SEARCH_GRACE_MS;
  }

  function isSearchActiveGrace() {
    return Date.now() < searchActiveUntil;
  }

  function getSearchBoxFocused(searchBox) {
    if (!searchBox) return false;
    if (searchBox.matches?.(":focus-within")) return true;
    const active = searchBox.shadowRoot?.activeElement;
    return !!(active && searchBox.contains(active));
  }

  function isSearchBoxActive() {
    const searchBox = getSearchBox();
    if (isSearchSuggestionsOpen()) return true;
    if (!searchBox) return isSearchActiveGrace();

    if (
      searchBox.hasAttribute("focused") ||
      searchBox.hasAttribute("has-focus") ||
      searchBox.hasAttribute("is-focused") ||
      searchBox.hasAttribute("active")
    ) {
      return true;
    }

    if (getSearchBoxFocused(searchBox)) return true;

    const input = getSearchInput();
    if (input && document.activeElement === input) return true;

    const active = getActiveElementDeep(document);
    if (active && (active === searchBox || searchBox.contains(active))) return true;
    if (input && (input === active || input.contains?.(active))) return true;

    return isSearchActiveGrace();
  }

  function isSearchInteractionActive() {
    const input = getSearchInput();
    if (input && (document.activeElement === input || input.contains?.(document.activeElement))) return true;
    return isSearchSuggestionsOpen();
  }

  function eventFromSearchUI(e) {
    const path = e.composedPath?.() || [];
    for (const node of path) {
      if (!node || node.nodeType !== 1) continue;
      const tag = node.tagName?.toLowerCase();
      if (tag === "ytd-searchbox" || tag === "ytd-searchbox-suggestions" || tag === "yt-searchbox") return true;
      if (node.id === "search") return true;
    }
    return false;
  }

  function bindSearchSuggestionsObserver() {
    const el = getSearchSuggestionsElement();
    if (!el) return;
    if (searchSuggestObserver && searchSuggestEl === el) return;

    if (searchSuggestObserver) {
      searchSuggestObserver.disconnect();
      searchSuggestObserver = null;
    }

    searchSuggestEl = el;
    searchSuggestObserver = new MutationObserver(() => {
      bumpSearchActive();
      scheduleHeaderPinUpdate();
    });
    searchSuggestObserver.observe(el, {
      attributes: true,
      attributeFilter: ["hidden", "open", "aria-hidden"],
    });
  }

  function unbindSearchSuggestionsObserver() {
    if (!searchSuggestObserver) return;
    searchSuggestObserver.disconnect();
    searchSuggestObserver = null;
    searchSuggestEl = null;
  }

  function updateHeaderPinnedFromSearch() {
    if (!isWatch() || !headerHoverEnabled) {
      headerPinned = false;
      return;
    }
    bindSearchSuggestionsObserver();
    headerPinned = isSearchBoxActive();
    if (headerPinned) {
      const header = getHeaderEl();
      if (header) setHeaderVisible(header, true);
    }
  }

  function scheduleHeaderPinUpdate() {
    if (headerPinRaf) return;
    headerPinRaf = requestAnimationFrame(() => {
      headerPinRaf = 0;
      updateHeaderPinnedFromSearch();
    });
  }

  // Mouse listener ONCE
  let headerMouseBound = false;
  let headerMouseTicking = false;
  let headerMouseY = 0;
  function bindHeaderMouse() {
    if (headerMouseBound) return;
    headerMouseBound = true;

    document.addEventListener("mousemove", (e) => {
      if (!headerHoverEnabled || headerPinned) return;
      headerMouseY = e.clientY;
      if (headerMouseTicking) return;
      headerMouseTicking = true;
      requestAnimationFrame(() => {
        headerMouseTicking = false;
        if (!headerHoverEnabled || headerPinned) return;
        const header = getHeaderEl();
        if (!header) return;

        if (headerMouseY <= YT_HDR_SHOW_ZONE) {
          if (headerHideTimer) clearTimeout(headerHideTimer);
          headerHideTimer = null;
          setHeaderVisible(header, true);
          return;
        }

        header.style.pointerEvents = "none";
        if (headerHideTimer) return;
        headerHideTimer = setTimeout(() => {
          headerHideTimer = null;
          if (!headerHoverEnabled || headerPinned) return;
          setHeaderVisible(header, false);
        }, YT_HDR_HIDE_DELAY);
      });
    }, { passive: true });

    document.addEventListener("scroll", () => {
      if (!headerHoverEnabled || !headerPinned || !isWatch()) return;
      if (isSearchSuggestionsOpen() || isSearchActiveGrace()) return;
      headerPinned = false;
    }, { passive: true });

    document.addEventListener("click", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      if (eventFromSearchUI(e)) {
        bumpSearchActive();
        bindSearchSuggestionsObserver();
        scheduleHeaderPinUpdate();
        return;
      }
      if (!headerPinned) return;
      headerPinned = false;
    }, true);

    document.addEventListener("input", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      const input = getSearchInput();
      if (!input || e.target !== input) return;
      bumpSearchActive();
      bindSearchSuggestionsObserver();
      scheduleHeaderPinUpdate();
    }, true);

    document.addEventListener("focusin", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      const input = getSearchInput();
      if (!input || e.target !== input) return;
      bumpSearchActive();
      bindSearchSuggestionsObserver();
      scheduleHeaderPinUpdate();
    }, true);

    document.addEventListener("focusout", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      const input = getSearchInput();
      if (!input || e.target !== input) return;
      if (isSearchSuggestionsOpen() || isSearchActiveGrace()) return;
      headerPinned = false;
    }, true);

    document.addEventListener("pointerdown", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      if (!eventFromSearchUI(e)) return;
      bumpSearchActive();
      bindSearchSuggestionsObserver();
      scheduleHeaderPinUpdate();
    }, true);
  }

   /* =========================================================
   * DOCK BUTTONS (optimized) + Fullscreen auto-hide + Anti-flicker
   * + NEW: "Go to top" button when dock is collapsed (⚙️ state)
   * ========================================================= */

  /* =========================================================
   * DOCK IDLE: dim then auto-collapse (eco/perf)
   * ========================================================= */
  let dockDimTimer = null;
  let dockCollapseTimer = null;

  function clearDockIdleTimers() {
    if (dockDimTimer) clearTimeout(dockDimTimer);
    if (dockCollapseTimer) clearTimeout(dockCollapseTimer);
    dockDimTimer = null;
    dockCollapseTimer = null;
  }

  function setDockDim(dock, dimmed) {
    if (!dock) return;
    const perf = (getMode() === "perf");
    dock.style.transition = perf ? "opacity 180ms ease" : "none";
    dock.style.opacity = dimmed ? "0.62" : "1";
  }

  function armDockIdle(dock, scope /* "home" | "watch" */) {
    if (!dock) return;

    if (scope === "home" && uiCollapsed) return;
    if (scope === "watch" && uiCollapsedWatch) return;

    const perf = (getMode() === "perf");
    const dimDelay = perf ? 5000 : 10000;
    const collapseDelay = perf ? 10000 : 15000;

    clearDockIdleTimers();
    setDockDim(dock, false);

    dockDimTimer = setTimeout(() => {
      if (!dock.isConnected) return;
      if (dock.matches(":hover")) return;
      setDockDim(dock, true);
    }, dimDelay);

    dockCollapseTimer = setTimeout(() => {
      if (!dock.isConnected) return;
      if (dock.matches(":hover")) return;

      if (scope === "home") setUiCollapsed(true);
      else setUiCollapsedWatch(true);

      setDockDim(dock, false);
      forceRenderDockNow();
      scheduleRun(true);
    }, collapseDelay);
  }

  function ensureDockIdleListeners(dock) {
    if (!dock || dock.dataset.ytcfIdleBound === "1") return;
    dock.dataset.ytcfIdleBound = "1";

    const wake = () => {
      clearDockIdleTimers();
      setDockDim(dock, false);

      if (isHome() && !uiCollapsed) armDockIdle(dock, "home");
      else if (isWatch() && !uiCollapsedWatch) armDockIdle(dock, "watch");
    };

    dock.addEventListener("mouseenter", wake, true);
    dock.addEventListener("mousedown", wake, true);
    dock.addEventListener("focusin", wake, true);
    dock.addEventListener("touchstart", wake, { passive: true, capture: true });
  }

  const DOCK_ID = "ytcf-dock";
  const BTN_SHORTS = "ytcf-btn-shorts";
  const BTN_HOME = "ytcf-btn-home";
  const BTN_WATCH = "ytcf-btn-watch";
  const BTN_COLLAPSE = "ytcf-btn-collapse";
  const BTN_EXPAND = "ytcf-btn-expand";
  const BTN_WATCH_COLLAPSE = "ytcf-btn-watch-collapse";
  const BTN_WATCH_EXPAND = "ytcf-btn-watch-expand";
  const BTN_HEADER = "ytcf-btn-header"; // ✅ header toggle on /watch
  const BTN_MODE_STATUS = "ytcf-btn-mode-status";
  const BTN_MODE_CHANGE = "ytcf-btn-mode-change";
  const BTN_MENU_HOME = "ytcf-btn-menu-home";
  const BTN_MENU_GENERAL = "ytcf-btn-menu-general";
  const BTN_MENU_SEARCH = "ytcf-btn-menu-search";
  const BTN_MENU_SIDEBAR = "ytcf-btn-menu-sidebar";
  const BTN_MENU_WATCH = "ytcf-btn-menu-watch";
  const BTN_MENU_ADV = "ytcf-btn-menu-adv";
  const BTN_MENU_BACK = "ytcf-btn-menu-back";
  const BTN_MENU_TITLE = "ytcf-btn-menu-title";

  // ✅ NEW: Go top (only when dock collapsed & user scrolled enough)
  const BTN_GO_TOP = "ytcf-btn-go-top";
  const GO_TOP_ICON = "⬆️";

  // ✅ NEW: show only when user really scrolled
  function shouldShowGoTop() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const threshold = Math.max(650, Math.floor((window.innerHeight || 800) * 1.4));
    return y >= threshold;
  }

  function applyGearHover(btn) {
    if (!btn) return;
    if (btn.dataset.ytcfGearInit === "1") return;
    btn.dataset.ytcfGearInit = "1";

    const fullLabel = T.dock_expand;
    if (!btn.isConnected) return;
    btn.textContent = "??";
    btn.style.width = "28px";
    btn.style.maxWidth = "28px";
    btn.style.paddingLeft = "0";
    btn.style.paddingRight = "0";
    btn.title = fullLabel;
    btn.setAttribute("aria-label", fullLabel);
  }

  function applyGoTopHover(btn) {
    if (!btn) return;
    if (btn.dataset.ytcfGoTopInit === "1") return;
    btn.dataset.ytcfGoTopInit = "1";

    const fullLabel = T.dock_go_top || "Go to the top of the page";

    // default: icon only
    btn.textContent = GO_TOP_ICON;
    btn.style.width = "28px";
    btn.style.maxWidth = "28px";
    btn.style.paddingLeft = "0";
    btn.style.paddingRight = "0";
    btn.title = fullLabel;
    btn.setAttribute("aria-label", fullLabel);

    const showText = () => {
      if (!btn.isConnected) return;
      btn.textContent = fullLabel;
      btn.style.width = "auto";
      btn.style.maxWidth = "unset";
      btn.style.paddingLeft = "12px";
      btn.style.paddingRight = "12px";
      btn.title = "";
    };

    const showIcon = () => {
      if (!btn.isConnected) return;
      btn.textContent = GO_TOP_ICON;
      btn.style.width = "28px";
      btn.style.maxWidth = "28px";
      btn.style.paddingLeft = "0";
      btn.style.paddingRight = "0";
      btn.title = fullLabel;
    };

    btn.addEventListener("mouseenter", showText);
    btn.addEventListener("mouseleave", showIcon);
    btn.addEventListener("focus", showText);
    btn.addEventListener("blur", showIcon);
  }

  function goTopNow(clickedBtn) {
    // disappear immediately on use
    if (clickedBtn) clickedBtn.style.display = "none";

    const perf = (getMode() === "perf");
    if (perf) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }

    // ensure dock refreshes after scroll movement settles a bit
    setTimeout(() => {
      forceRenderDockNow();
      scheduleRun(true);
    }, perf ? 120 : 0);
  }

  // ✅ minimal scroll watcher to show/hide the button (especially in ECO)
  let lastGoTopVisible = null;
  let scrollTicking = false;
  function onScrollMaybeUpdateDock() {
    if (!getBool(KEY.floatButtons)) return;

    const vis = shouldShowGoTop();
    if (vis === lastGoTopVisible) return;
    lastGoTopVisible = vis;

    // rebuild dock so the button appears/disappears
    forceRenderDockNow();
  }

  function bindScrollForGoTopOnce() {
    if (bindScrollForGoTopOnce._done) return;
    bindScrollForGoTopOnce._done = true;

    window.addEventListener("scroll", () => {
      if (scrollTicking) return;
      scrollTicking = true;

      const perf = (getMode() === "perf");
      if (perf) {
        requestAnimationFrame(() => {
          scrollTicking = false;
          onScrollMaybeUpdateDock();
        });
      } else {
        const delay = isUltraMode() ? 320 : 180;
        setTimeout(() => {
          scrollTicking = false;
          onScrollMaybeUpdateDock();
        }, delay);
      }
    }, { passive: true });
  }

  let fsRestoreTimer = null;

  // Anti-flicker state
  let lastDockKey = "";
  let dockIsHidden = false;
  let dockWasFullscreen = false;
  let dockSubmenu = null; // "home" | "search" | "sidebar" | "watch" | "advanced" | null
  let modeChangeRevealUntil = 0;
  let langChangeRevealUntil = 0;
  let minViewsChangeRevealUntil = 0;
  let minLiveViewsChangeRevealUntil = 0;

  function isFullscreenNow() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }

  function ensureDock() {
    let dock = document.getElementById(DOCK_ID);
    if (dock) return dock;

    dock = document.createElement("div");
    dock.id = DOCK_ID;
    dock.style.cssText = `
      position: fixed;
      right: 12px;
      bottom: 12px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: flex-end;
      pointer-events: auto;
    `;
    document.documentElement.appendChild(dock);
    dockIsHidden = false;
    return dock;
  }

  function makeDockButton(id, text) {
    const btn = document.createElement("button");
    btn.id = id;
    btn.type = "button";
    btn.textContent = text;
    btn.style.cssText = `
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(0,0,0,0.72);
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.2);
      cursor: pointer;
      font-size: 12px;
      transform: translateZ(0);
    `;
    if (getMode() !== "perf") {
      btn.style.transform = "none";
    } else {
      btn.style.background = "linear-gradient(180deg, rgba(18,18,18,0.9), rgba(0,0,0,0.72))";
      btn.style.border = "1px solid rgba(255,255,255,0.28)";
      btn.style.boxShadow = "0 10px 22px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)";
      btn.style.backdropFilter = "blur(6px)";
      btn.style.webkitBackdropFilter = "blur(6px)";
      btn.style.transition = "transform 160ms ease, box-shadow 160ms ease, background 160ms ease";
    }
    return btn;
  }

  const MODE_COLORS = {
    ultra: {
      bg: "#E76F51",
      border: "#F4A08A",
      bgInactive: "#F0A891",
      borderInactive: "#F7C2B4",
      text: "#FFFFFF",
      kind: "ultra",
    },
    eco: {
      bg: "#2A9D8F",
      border: "#53B2A8",
      bgInactive: "#5FB8AD",
      borderInactive: "#8ED0C8",
      text: "#FFFFFF",
      kind: "eco",
    },
    perf: {
      bg: "#3A86FF",
      border: "#6CA6FF",
      bgInactive: "#6FA8FF",
      borderInactive: "#A6C7FF",
      text: "#FFFFFF",
      kind: "perf",
    },
  };

  function getModeStatusText() {
    const m = getMode();
    if (m === "ultra") return T.dock_mode_status_ultra;
    if (m === "perf") return T.dock_mode_status_perf;
    return T.dock_mode_status_eco;
  }

  function getModeInfoText(mode) {
    if (mode === "ultra") return T.dock_mode_info_ultra;
    if (mode === "perf") return T.dock_mode_info_perf;
    return T.dock_mode_info_eco;
  }

  function applyModeAndNotify(next) {
    setMode(next);
    if (next === "perf") showToast(T.toast_mode_perf, "info");
    else if (next === "ultra") showToast(T.toast_mode_ultra, "info");
    else showToast(T.toast_mode_eco, "info");
    applyMode();
    registerMenu();
    forceRenderDockNow();
  }

  const DOCK_STYLE_ID = "ytcf-dock-style";

  function ensureDockStyle() {
    if (document.getElementById(DOCK_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = DOCK_STYLE_ID;
    style.textContent = `
      @keyframes ytcf-eco-pulse {
        0% { box-shadow: 0 0 0 rgba(34,197,94,0); }
        50% { box-shadow: 0 0 12px rgba(34,197,94,0.35); }
        100% { box-shadow: 0 0 0 rgba(34,197,94,0); }
      }
      @keyframes ytcf-perf-pulse {
        0% { box-shadow: 0 0 0 rgba(59,130,246,0); }
        50% { box-shadow: 0 0 14px rgba(59,130,246,0.45); }
        100% { box-shadow: 0 0 0 rgba(59,130,246,0); }
      }
      @keyframes ytcf-ultra-pulse {
        0% { box-shadow: 0 0 0 rgba(231,111,81,0); }
        50% { box-shadow: 0 0 10px rgba(231,111,81,0.35); }
        100% { box-shadow: 0 0 0 rgba(231,111,81,0); }
      }
      .ytcf-mode-anim-eco { animation: ytcf-eco-pulse 2.8s ease-in-out infinite; }
      .ytcf-mode-anim-perf { animation: ytcf-perf-pulse 1.8s ease-in-out infinite; }
      .ytcf-mode-anim-ultra { animation: ytcf-ultra-pulse 3.4s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .ytcf-mode-anim-eco,
        .ytcf-mode-anim-perf,
        .ytcf-mode-anim-ultra { animation: none; }
      }
    `;
    document.documentElement.appendChild(style);
  }

  function getModeAnimationClass() {
    const mode = getMode();
    if (mode === "perf") return "ytcf-mode-anim-perf";
    if (mode === "ultra") return "ytcf-mode-anim-ultra";
    return "ytcf-mode-anim-eco";
  }

  function renderToggleState(container, label, isOn) {
    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    labelSpan.style.color = "#fff";
    labelSpan.style.textShadow = "0 1px 2px rgba(0,0,0,0.6)";

    const sep = document.createTextNode(" : ");

    const stateSpan = document.createElement("span");
    stateSpan.textContent = isOn ? T.status_on : T.status_off;
    stateSpan.style.color = isOn ? "#22c55e" : "#ef4444";
    stateSpan.style.fontWeight = "700";
    stateSpan.style.textShadow = "0 1px 2px rgba(0,0,0,0.6)";

    container.replaceChildren(labelSpan, sep, stateSpan);
  }

  function renderCountState(container, label, count) {
    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    labelSpan.style.color = "#fff";
    labelSpan.style.textShadow = "0 1px 2px rgba(0,0,0,0.6)";

    const sep = document.createTextNode(" : ");

    const countSpan = document.createElement("span");
    countSpan.textContent = String(Math.max(0, Number(count) || 0));
    countSpan.style.color = "#60a5fa";
    countSpan.style.fontWeight = "700";
    countSpan.style.textShadow = "0 1px 2px rgba(0,0,0,0.6)";

    container.replaceChildren(labelSpan, sep, countSpan);
  }

  function getGroupState(keys) {
    return keys.every(k => getBool(k));
  }

  function setGroupState(keys, next) {
    keys.forEach(k => setBool(k, next));
  }

  function makeToggleRow(options) {
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.gap = "6px";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "flex-end";

    const actionBtn = makeDockButton(options.actionId, "");
    const stateBtn = makeDockButton(options.stateId, "");
    stateBtn.setAttribute("aria-disabled", "true");
    stateBtn.style.pointerEvents = "none";

    const infoBtn = makeInfoIcon(options.infoText);

    const perf = getMode() === "perf";
    const canHoverAction = true;

    actionBtn.style.whiteSpace = "nowrap";
    if (perf) {
      actionBtn.style.maxWidth = "0";
      actionBtn.style.paddingLeft = "0";
      actionBtn.style.paddingRight = "0";
      actionBtn.style.opacity = "0";
      actionBtn.style.transform = "translateX(6px)";
      actionBtn.style.marginRight = "-6px";
      actionBtn.style.overflow = "hidden";
      actionBtn.style.pointerEvents = "none";
      actionBtn.style.transition = "max-width 180ms ease, padding 180ms ease, opacity 180ms ease, transform 180ms ease";
    } else {
      actionBtn.style.display = "none";
      actionBtn.style.pointerEvents = "none";
    }

    const render = () => {
      renderToggleState(stateBtn, options.label, getBool(options.key));
      actionBtn.textContent = getBool(options.key) ? options.actionOn : options.actionOff;
    };

    actionBtn.addEventListener("click", () => {
      const next = !getBool(options.key);
      setBool(options.key, next);
      options.onToggle?.(next);
      render();
      registerMenu();
      forceRenderDockNow();
    });

    const showAction = () => {
      if (!canHoverAction) return;
      if (perf) {
        actionBtn.style.maxWidth = "260px";
        actionBtn.style.paddingLeft = "12px";
        actionBtn.style.paddingRight = "12px";
        actionBtn.style.opacity = "1";
        actionBtn.style.transform = "translateX(0)";
        actionBtn.style.marginRight = "0";
        actionBtn.style.pointerEvents = "auto";
      } else {
        actionBtn.style.display = "";
        actionBtn.style.pointerEvents = "auto";
      }
    };

    const hideAction = () => {
      if (perf) {
        actionBtn.style.maxWidth = "0";
        actionBtn.style.paddingLeft = "0";
        actionBtn.style.paddingRight = "0";
        actionBtn.style.opacity = "0";
        actionBtn.style.transform = "translateX(6px)";
        actionBtn.style.marginRight = "-6px";
        actionBtn.style.pointerEvents = "none";
      } else {
        actionBtn.style.display = "none";
        actionBtn.style.pointerEvents = "none";
      }
    };

    render();
    hideAction();

    if (canHoverAction) {
      wrap.addEventListener("mouseenter", showAction);
      wrap.addEventListener("mouseleave", hideAction);
      wrap.addEventListener("focusin", showAction);
      wrap.addEventListener("focusout", hideAction);
    }

    wrap.append(actionBtn, stateBtn, infoBtn);
    return wrap;
  }

  function makeActionRow(options) {
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.gap = "6px";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "flex-end";

    const actionBtn = makeDockButton(options.actionId, "");
    const stateBtn = makeDockButton(options.stateId, "");
    stateBtn.setAttribute("aria-disabled", "true");
    stateBtn.style.pointerEvents = "none";

    const infoBtn = makeInfoIcon(options.infoText);

    const perf = getMode() === "perf";
    const canHoverAction = true;

    actionBtn.style.whiteSpace = "nowrap";
    if (perf) {
      actionBtn.style.maxWidth = "0";
      actionBtn.style.paddingLeft = "0";
      actionBtn.style.paddingRight = "0";
      actionBtn.style.opacity = "0";
      actionBtn.style.transform = "translateX(6px)";
      actionBtn.style.marginRight = "-6px";
      actionBtn.style.overflow = "hidden";
      actionBtn.style.pointerEvents = "none";
      actionBtn.style.transition = "max-width 180ms ease, padding 180ms ease, opacity 180ms ease, transform 180ms ease";
    } else {
      actionBtn.style.display = "none";
      actionBtn.style.pointerEvents = "none";
    }

    const render = () => {
      renderCountState(stateBtn, options.label, options.count());
      actionBtn.textContent = options.actionLabel;
    };

    actionBtn.addEventListener("click", () => {
      options.onAction?.();
      render();
      registerMenu();
      forceRenderDockNow();
    });

    const showAction = () => {
      if (!canHoverAction) return;
      if (perf) {
        actionBtn.style.maxWidth = "260px";
        actionBtn.style.paddingLeft = "12px";
        actionBtn.style.paddingRight = "12px";
        actionBtn.style.opacity = "1";
        actionBtn.style.transform = "translateX(0)";
        actionBtn.style.marginRight = "0";
        actionBtn.style.pointerEvents = "auto";
      } else {
        actionBtn.style.display = "";
        actionBtn.style.pointerEvents = "auto";
      }
    };

    const hideAction = () => {
      if (perf) {
        actionBtn.style.maxWidth = "0";
        actionBtn.style.paddingLeft = "0";
        actionBtn.style.paddingRight = "0";
        actionBtn.style.opacity = "0";
        actionBtn.style.transform = "translateX(6px)";
        actionBtn.style.marginRight = "-6px";
        actionBtn.style.pointerEvents = "none";
      } else {
        actionBtn.style.display = "none";
        actionBtn.style.pointerEvents = "none";
      }
    };

    render();
    hideAction();

    if (canHoverAction) {
      wrap.addEventListener("mouseenter", showAction);
      wrap.addEventListener("mouseleave", hideAction);
      wrap.addEventListener("focusin", showAction);
      wrap.addEventListener("focusout", hideAction);
    }

    wrap.append(actionBtn, stateBtn, infoBtn);
    return wrap;
  }

  function makeToggleRowGroup(options) {
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.gap = "6px";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "flex-end";

    const actionBtn = makeDockButton(options.actionId, "");
    const stateBtn = makeDockButton(options.stateId, "");
    stateBtn.setAttribute("aria-disabled", "true");
    stateBtn.style.pointerEvents = "none";

    const infoBtn = makeInfoIcon(options.infoText);

    const perf = getMode() === "perf";
    const canHoverAction = true;

    actionBtn.style.whiteSpace = "nowrap";
    if (perf) {
      actionBtn.style.maxWidth = "0";
      actionBtn.style.paddingLeft = "0";
      actionBtn.style.paddingRight = "0";
      actionBtn.style.opacity = "0";
      actionBtn.style.transform = "translateX(6px)";
      actionBtn.style.marginRight = "-6px";
      actionBtn.style.overflow = "hidden";
      actionBtn.style.pointerEvents = "none";
      actionBtn.style.transition = "max-width 180ms ease, padding 180ms ease, opacity 180ms ease, transform 180ms ease";
    } else {
      actionBtn.style.display = "none";
      actionBtn.style.pointerEvents = "none";
    }

    const render = () => {
      const isOn = options.isOn();
      renderToggleState(stateBtn, options.label, isOn);
      actionBtn.textContent = isOn ? options.actionOn : options.actionOff;
    };

    actionBtn.addEventListener("click", () => {
      const next = !options.isOn();
      options.onToggle?.(next);
      render();
      registerMenu();
      forceRenderDockNow();
    });

    const showAction = () => {
      if (!canHoverAction) return;
      if (perf) {
        actionBtn.style.maxWidth = "260px";
        actionBtn.style.paddingLeft = "12px";
        actionBtn.style.paddingRight = "12px";
        actionBtn.style.opacity = "1";
        actionBtn.style.transform = "translateX(0)";
        actionBtn.style.marginRight = "0";
        actionBtn.style.pointerEvents = "auto";
      } else {
        actionBtn.style.display = "";
        actionBtn.style.pointerEvents = "auto";
      }
    };

    const hideAction = () => {
      if (perf) {
        actionBtn.style.maxWidth = "0";
        actionBtn.style.paddingLeft = "0";
        actionBtn.style.paddingRight = "0";
        actionBtn.style.opacity = "0";
        actionBtn.style.transform = "translateX(6px)";
        actionBtn.style.marginRight = "-6px";
        actionBtn.style.pointerEvents = "none";
      } else {
        actionBtn.style.display = "none";
        actionBtn.style.pointerEvents = "none";
      }
    };

    render();
    hideAction();

    if (canHoverAction) {
      wrap.addEventListener("mouseenter", showAction);
      wrap.addEventListener("mouseleave", hideAction);
      wrap.addEventListener("focusin", showAction);
      wrap.addEventListener("focusout", hideAction);
    }

    wrap.append(actionBtn, stateBtn, infoBtn);
    return wrap;
  }

  const MIN_VIEWS_STEPS = [
    1000,
    5000,
    10000,
    20000,
    50000,
    100000,
    200000,
    500000,
    1000000,
    2000000,
    5000000,
  ];

  const MIN_LIVE_VIEWS_STEPS = [
    10,
    25,
    50,
    100,
    250,
    500,
    1000,
    2000,
    5000,
    10000,
  ];

  function formatViewsShort(value) {
    const v = Math.max(0, Math.round(Number(value) || 0));
    if (v >= 1e6) {
      const num = v / 1e6;
      const text = (num % 1 === 0) ? num.toFixed(0) : num.toFixed(1);
      return `${text.replace(/\.0$/, "")}M`;
    }
    if (v >= 1e3) {
      const num = v / 1e3;
      const text = (num % 1 === 0) ? num.toFixed(0) : num.toFixed(1);
      return `${text.replace(/\.0$/, "")}k`;
    }
    return String(v);
  }

  function parseCustomViewsInput(input) {
    const raw = String(input || "").trim();
    if (!raw) return null;

    const cleaned = raw.toLowerCase().replace(/\s+/g, "").replace(/,/g, ".");
    if (/^\d+$/.test(cleaned)) return Math.round(Number(cleaned));

    const kmDecimal = cleaned.match(/^(\d+(?:\.\d+)?)([km])$/);
    if (kmDecimal) {
      const num = Number(kmDecimal[1]);
      const mult = kmDecimal[2] === "m" ? 1e6 : 1e3;
      if (!Number.isFinite(num)) return null;
      return Math.round(num * mult);
    }

    const kmCompact = cleaned.match(/^(\d+)([km])(\d+)$/);
    if (kmCompact) {
      const base = parseInt(kmCompact[1], 10);
      const unit = kmCompact[2] === "m" ? 1e6 : 1e3;
      const suffix = kmCompact[3];
      const unitPow = kmCompact[2] === "m" ? 6 : 3;
      const scalePow = unitPow - suffix.length;
      if (scalePow < 0) return null;
      const suffixVal = parseInt(suffix, 10) * Math.pow(10, scalePow);
      return Math.round(base * unit + suffixVal);
    }

    return null;
  }

  function getMinViewsDownValue(cur) {
    for (let i = MIN_VIEWS_STEPS.length - 1; i >= 0; i--) {
      if (MIN_VIEWS_STEPS[i] < cur) return MIN_VIEWS_STEPS[i];
    }
    return cur;
  }

  function getMinViewsUpValue(cur) {
    for (const step of MIN_VIEWS_STEPS) {
      if (step > cur) return step;
    }
    return cur;
  }

  function getMinLiveViewsDownValue(cur) {
    for (let i = MIN_LIVE_VIEWS_STEPS.length - 1; i >= 0; i--) {
      if (MIN_LIVE_VIEWS_STEPS[i] < cur) return MIN_LIVE_VIEWS_STEPS[i];
    }
    return cur;
  }

  function getMinLiveViewsUpValue(cur) {
    for (const step of MIN_LIVE_VIEWS_STEPS) {
      if (step > cur) return step;
    }
    return cur;
  }

  function makeMinViewsRow() {
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.gap = "6px";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "flex-end";

    const customBtn = makeDockButton("ytcf-btn-lowpop-min-custom", T.dock_lowpop_min_custom || "Custom");
    const downBtn = makeDockButton("ytcf-btn-lowpop-min-down", "⬇️");
    const upBtn = makeDockButton("ytcf-btn-lowpop-min-up", "⬆️");
    const stateBtn = makeDockButton("ytcf-btn-lowpop-min-state", "");
    stateBtn.setAttribute("aria-disabled", "true");
    stateBtn.style.pointerEvents = "none";

    const perf = getMode() === "perf";
    customBtn.style.whiteSpace = "nowrap";
    downBtn.style.whiteSpace = "nowrap";
    upBtn.style.whiteSpace = "nowrap";

    if (perf) {
      for (const btn of [customBtn, downBtn, upBtn]) {
        btn.style.maxWidth = "0";
        btn.style.paddingLeft = "0";
        btn.style.paddingRight = "0";
        btn.style.opacity = "0";
        btn.style.transform = "translateX(6px)";
        btn.style.marginRight = "-6px";
        btn.style.overflow = "hidden";
        btn.style.pointerEvents = "none";
        btn.style.transition = "max-width 180ms ease, padding 180ms ease, opacity 180ms ease, transform 180ms ease";
      }
    } else {
      customBtn.style.display = "none";
      downBtn.style.display = "none";
      upBtn.style.display = "none";
      customBtn.style.pointerEvents = "none";
      downBtn.style.pointerEvents = "none";
      upBtn.style.pointerEvents = "none";
    }

    const label = T.dock_lowpop_min_label || "Low-pop min views";

    const render = () => {
      const cur = getMinViews();
      stateBtn.textContent = `${label}: ${formatViewsShort(cur)}`;
      const downNext = getMinViewsDownValue(cur);
      const upNext = getMinViewsUpValue(cur);
      downBtn.title = `${label}: ${formatViewsShort(downNext)}`;
      upBtn.title = `${label}: ${formatViewsShort(upNext)}`;
      customBtn.title = T.dock_lowpop_min_prompt || "Enter a threshold (e.g. 1k, 1M, 1k3)";
    };

    const applyMinViewsChange = (next) => {
      minViewsChangeRevealUntil = Date.now() + 500;
      setMinViews(next);
      resetLowpopProcessed();
      unhideLowpop();
      if (!isUltraMode()) {
        if (getBool(KEY.lowpopHome)) scanHomeLowpop(homeContainer());
        if (getBool(KEY.lowpopSearch)) scanSearchLowpop(searchContainer());
        if (getBool(KEY.lowpopWatch)) scanWatchLowpop(watchContainer());
      }
      render();
      forceRenderDockNow();
      scheduleRun(true);
      showToast(T.toast_updated || "Updated", "info");
    };

    customBtn.addEventListener("click", () => {
      minViewsChangeRevealUntil = Date.now() + 500;
      const promptText = T.dock_lowpop_min_prompt || "Enter a threshold (e.g. 1k, 1M, 1k3)";
      const input = window.prompt(promptText, String(getMinViews()));
      if (input == null) return;
      const parsed = parseCustomViewsInput(input);
      if (!parsed || parsed <= 0) {
        showToast(T.dock_lowpop_min_invalid || "Invalid value", "off");
        return;
      }
      applyMinViewsChange(parsed);
    });

    downBtn.addEventListener("click", () => {
      applyMinViewsChange(getMinViewsDownValue(getMinViews()));
    });

    upBtn.addEventListener("click", () => {
      applyMinViewsChange(getMinViewsUpValue(getMinViews()));
    });

    const showAction = () => {
      if (perf) {
        for (const btn of [customBtn, downBtn, upBtn]) {
          btn.style.maxWidth = "240px";
          btn.style.paddingLeft = "12px";
          btn.style.paddingRight = "12px";
          btn.style.opacity = "1";
          btn.style.transform = "translateX(0)";
          btn.style.marginRight = "0";
          btn.style.pointerEvents = "auto";
        }
      } else {
        customBtn.style.display = "";
        downBtn.style.display = "";
        upBtn.style.display = "";
        customBtn.style.pointerEvents = "auto";
        downBtn.style.pointerEvents = "auto";
        upBtn.style.pointerEvents = "auto";
      }
    };

    const hideAction = () => {
      if (perf) {
        for (const btn of [customBtn, downBtn, upBtn]) {
          btn.style.maxWidth = "0";
          btn.style.paddingLeft = "0";
          btn.style.paddingRight = "0";
          btn.style.opacity = "0";
          btn.style.transform = "translateX(6px)";
          btn.style.marginRight = "-6px";
          btn.style.pointerEvents = "none";
        }
      } else {
        customBtn.style.display = "none";
        downBtn.style.display = "none";
        upBtn.style.display = "none";
        customBtn.style.pointerEvents = "none";
        downBtn.style.pointerEvents = "none";
        upBtn.style.pointerEvents = "none";
      }
    };

    render();
    hideAction();

    let hideTimer = null;
    const show = () => {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = null;
      showAction();
    };
    const scheduleHide = () => {
      if (hideTimer) clearTimeout(hideTimer);
      const delay = Math.max(0, minViewsChangeRevealUntil - Date.now());
      if (delay === 0) {
        if (!wrap.matches(":hover")) hideAction();
        return;
      }
      hideTimer = setTimeout(() => {
        if (!wrap.matches(":hover")) hideAction();
      }, delay);
    };

    if (Date.now() < minViewsChangeRevealUntil) show();

    wrap.addEventListener("mouseenter", show);
    wrap.addEventListener("mouseleave", scheduleHide);
    wrap.addEventListener("focusin", show);
    wrap.addEventListener("focusout", scheduleHide);

    wrap.append(customBtn, downBtn, upBtn, stateBtn);
    return wrap;
  }

  function makeMinLiveViewsRow() {
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.gap = "6px";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "flex-end";

    const customBtn = makeDockButton("ytcf-btn-lowlive-min-custom", T.dock_lowlive_min_custom || "Custom");
    const downBtn = makeDockButton("ytcf-btn-lowlive-min-down", "⬇️");
    const upBtn = makeDockButton("ytcf-btn-lowlive-min-up", "⬆️");
    const stateBtn = makeDockButton("ytcf-btn-lowlive-min-state", "");
    stateBtn.setAttribute("aria-disabled", "true");
    stateBtn.style.pointerEvents = "none";

    const perf = getMode() === "perf";
    customBtn.style.whiteSpace = "nowrap";
    downBtn.style.whiteSpace = "nowrap";
    upBtn.style.whiteSpace = "nowrap";

    if (perf) {
      for (const btn of [customBtn, downBtn, upBtn]) {
        btn.style.maxWidth = "0";
        btn.style.paddingLeft = "0";
        btn.style.paddingRight = "0";
        btn.style.opacity = "0";
        btn.style.transform = "translateX(6px)";
        btn.style.marginRight = "-6px";
        btn.style.overflow = "hidden";
        btn.style.pointerEvents = "none";
        btn.style.transition = "max-width 180ms ease, padding 180ms ease, opacity 180ms ease, transform 180ms ease";
      }
    } else {
      customBtn.style.display = "none";
      downBtn.style.display = "none";
      upBtn.style.display = "none";
      customBtn.style.pointerEvents = "none";
      downBtn.style.pointerEvents = "none";
      upBtn.style.pointerEvents = "none";
    }

    const label = T.dock_lowlive_min_label || "Live min viewers";

    const render = () => {
      const cur = getMinLiveViews();
      stateBtn.textContent = `${label}: ${formatViewsShort(cur)}`;
      const downNext = getMinLiveViewsDownValue(cur);
      const upNext = getMinLiveViewsUpValue(cur);
      downBtn.title = `${label}: ${formatViewsShort(downNext)}`;
      upBtn.title = `${label}: ${formatViewsShort(upNext)}`;
      customBtn.title = T.dock_lowlive_min_prompt || "Enter a live threshold (e.g. 50, 1k)";
    };

    const applyMinLiveViewsChange = (next) => {
      minLiveViewsChangeRevealUntil = Date.now() + 500;
      setMinLiveViews(next);
      resetLowLiveProcessed();
      unhideLowLive();
      if (!isUltraMode()) {
        if (getBool(KEY.lowpopLiveHome)) scanHomeLowLive(homeContainer());
        if (getBool(KEY.lowpopLiveSearch)) scanSearchLowLive(searchContainer());
        if (getBool(KEY.lowpopLiveWatch)) scanWatchLowLive(watchContainer());
      }
      render();
      forceRenderDockNow();
      scheduleRun(true);
      showToast(T.toast_updated || "Updated", "info");
    };

    customBtn.addEventListener("click", () => {
      minLiveViewsChangeRevealUntil = Date.now() + 500;
      const promptText = T.dock_lowlive_min_prompt || "Enter a live threshold (e.g. 50, 1k)";
      const input = window.prompt(promptText, String(getMinLiveViews()));
      if (input == null) return;
      const parsed = parseCustomViewsInput(input);
      if (!parsed || parsed <= 0) {
        showToast(T.dock_lowlive_min_invalid || "Invalid value", "off");
        return;
      }
      applyMinLiveViewsChange(parsed);
    });

    downBtn.addEventListener("click", () => {
      applyMinLiveViewsChange(getMinLiveViewsDownValue(getMinLiveViews()));
    });

    upBtn.addEventListener("click", () => {
      applyMinLiveViewsChange(getMinLiveViewsUpValue(getMinLiveViews()));
    });

    const showAction = () => {
      if (perf) {
        for (const btn of [customBtn, downBtn, upBtn]) {
          btn.style.maxWidth = "240px";
          btn.style.paddingLeft = "12px";
          btn.style.paddingRight = "12px";
          btn.style.opacity = "1";
          btn.style.transform = "translateX(0)";
          btn.style.marginRight = "0";
          btn.style.pointerEvents = "auto";
        }
      } else {
        customBtn.style.display = "";
        downBtn.style.display = "";
        upBtn.style.display = "";
        customBtn.style.pointerEvents = "auto";
        downBtn.style.pointerEvents = "auto";
        upBtn.style.pointerEvents = "auto";
      }
    };

    const hideAction = () => {
      if (perf) {
        for (const btn of [customBtn, downBtn, upBtn]) {
          btn.style.maxWidth = "0";
          btn.style.paddingLeft = "0";
          btn.style.paddingRight = "0";
          btn.style.opacity = "0";
          btn.style.transform = "translateX(6px)";
          btn.style.marginRight = "-6px";
          btn.style.pointerEvents = "none";
        }
      } else {
        customBtn.style.display = "none";
        downBtn.style.display = "none";
        upBtn.style.display = "none";
        customBtn.style.pointerEvents = "none";
        downBtn.style.pointerEvents = "none";
        upBtn.style.pointerEvents = "none";
      }
    };

    render();
    hideAction();

    let hideTimer = null;
    const show = () => {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = null;
      showAction();
    };
    const scheduleHide = () => {
      if (hideTimer) clearTimeout(hideTimer);
      const delay = Math.max(0, minLiveViewsChangeRevealUntil - Date.now());
      if (delay === 0) {
        if (!wrap.matches(":hover")) hideAction();
        return;
      }
      hideTimer = setTimeout(() => {
        if (!wrap.matches(":hover")) hideAction();
      }, delay);
    };

    if (Date.now() < minLiveViewsChangeRevealUntil) show();

    wrap.addEventListener("mouseenter", show);
    wrap.addEventListener("mouseleave", scheduleHide);
    wrap.addEventListener("focusin", show);
    wrap.addEventListener("focusout", scheduleHide);

    wrap.append(customBtn, downBtn, upBtn, stateBtn);
    return wrap;
  }

  function makeLanguageRow() {
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.gap = "6px";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "flex-end";

    const leftBtn = makeDockButton("ytcf-btn-lang-prev", "⬅️");
    const rightBtn = makeDockButton("ytcf-btn-lang-next", "➡️");
    const stateBtn = makeDockButton("ytcf-btn-lang-state", "");
    stateBtn.setAttribute("aria-disabled", "true");
    stateBtn.style.pointerEvents = "none";

    const perf = getMode() === "perf";
    leftBtn.style.whiteSpace = "nowrap";
    rightBtn.style.whiteSpace = "nowrap";
    if (perf) {
      for (const btn of [leftBtn, rightBtn]) {
        btn.style.maxWidth = "0";
        btn.style.paddingLeft = "0";
        btn.style.paddingRight = "0";
        btn.style.opacity = "0";
        btn.style.transform = "translateX(6px)";
        btn.style.marginRight = "-6px";
        btn.style.overflow = "hidden";
        btn.style.pointerEvents = "none";
        btn.style.transition = "max-width 180ms ease, padding 180ms ease, opacity 180ms ease, transform 180ms ease";
      }
    } else {
      leftBtn.style.display = "none";
      rightBtn.style.display = "none";
      leftBtn.style.pointerEvents = "none";
      rightBtn.style.pointerEvents = "none";
    }

    const render = () => {
      const curSetting = getLangSetting();
      stateBtn.textContent = `${T.dock_lang_label}: ${getCurrentLangLabel()}`;
      leftBtn.title = getLangDisplayName(getPrevLangCode(curSetting));
      rightBtn.title = getLangDisplayName(getNextLangCode(curSetting));
    };

    leftBtn.addEventListener("click", () => {
      langChangeRevealUntil = Date.now() + 500;
      const prevCode = getPrevLangCode(getLangSetting());
      setLangSetting(prevCode);
      applyLanguage();
      render();
      registerMenu();
      forceRenderDockNow();
      scheduleRun(true);
    });
    rightBtn.addEventListener("click", () => {
      langChangeRevealUntil = Date.now() + 500;
      const nextCode = getNextLangCode(getLangSetting());
      setLangSetting(nextCode);
      applyLanguage();
      render();
      registerMenu();
      forceRenderDockNow();
      scheduleRun(true);
    });

    const showAction = () => {
      if (perf) {
        for (const btn of [leftBtn, rightBtn]) {
          btn.style.maxWidth = "240px";
          btn.style.paddingLeft = "12px";
          btn.style.paddingRight = "12px";
          btn.style.opacity = "1";
          btn.style.transform = "translateX(0)";
          btn.style.marginRight = "0";
          btn.style.pointerEvents = "auto";
        }
      } else {
        leftBtn.style.display = "";
        rightBtn.style.display = "";
        leftBtn.style.pointerEvents = "auto";
        rightBtn.style.pointerEvents = "auto";
      }
    };

    const hideAction = () => {
      if (perf) {
        for (const btn of [leftBtn, rightBtn]) {
          btn.style.maxWidth = "0";
          btn.style.paddingLeft = "0";
          btn.style.paddingRight = "0";
          btn.style.opacity = "0";
          btn.style.transform = "translateX(6px)";
          btn.style.marginRight = "-6px";
          btn.style.pointerEvents = "none";
        }
      } else {
        leftBtn.style.display = "none";
        rightBtn.style.display = "none";
        leftBtn.style.pointerEvents = "none";
        rightBtn.style.pointerEvents = "none";
      }
    };

    render();
    hideAction();

    let hideTimer = null;
    const show = () => {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = null;
      showAction();
    };
    const scheduleHide = () => {
      if (hideTimer) clearTimeout(hideTimer);
      const delay = Math.max(0, langChangeRevealUntil - Date.now());
      if (delay == 0) {
        if (!wrap.matches(":hover")) hideAction();
        return;
      }
      hideTimer = setTimeout(() => {
        if (!wrap.matches(":hover")) hideAction();
      }, delay);
    };

    if (Date.now() < langChangeRevealUntil) show();

    wrap.addEventListener("mouseenter", show);
    wrap.addEventListener("mouseleave", scheduleHide);
    wrap.addEventListener("focusin", show);
    wrap.addEventListener("focusout", scheduleHide);

    wrap.append(leftBtn, rightBtn, stateBtn);
    return wrap;
  }

  function makeMenuAccessButton(id, label, infoText, onClick, highlight = false) {
    const btn = makeDockButton(id, label);
    if (highlight) {
      btn.style.borderColor = "rgba(96,165,250,0.9)";
      btn.style.boxShadow = "0 0 18px rgba(59,130,246,0.45)";
      btn.style.background = "linear-gradient(180deg, rgba(59,130,246,0.2), rgba(0,0,0,0.8))";
      btn.style.color = "#f8fbff";
    }
    const show = () => showStickyToast(infoText, "info");
    const hide = () => hideToast();
    btn.addEventListener("mouseenter", show);
    btn.addEventListener("mouseleave", hide);
    btn.addEventListener("focus", show);
    btn.addEventListener("blur", hide);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });
    return btn;
  }

  function makeInfoIcon(message, kind = "info") {
    const info = document.createElement("button");
    info.type = "button";
    info.textContent = "i";
    info.style.cssText = `
      width: 18px;
      height: 18px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.6);
      background: rgba(0,0,0,0.6);
      color: #ffffff;
      font-size: 11px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
    `;

    info.addEventListener("mouseenter", () => showStickyToast(message, kind));
    info.addEventListener("mouseleave", hideToast);
    info.addEventListener("focus", () => showStickyToast(message, kind));
    info.addEventListener("blur", hideToast);
    return info;
  }

  function makeModeStatusGroup() {
    ensureDockStyle();
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.flexDirection = "row";
    wrap.style.gap = "6px";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "flex-end";

    const statusBtn = makeDockButton(BTN_MODE_STATUS, getModeStatusText());
    const color = MODE_COLORS[getMode()] || MODE_COLORS.eco;
    statusBtn.style.background = color.bg;
    statusBtn.style.border = `1px solid ${color.border}`;
    statusBtn.style.color = color.text;
    statusBtn.style.fontWeight = "700";
    statusBtn.classList.add(getModeAnimationClass());

    const changeBtn = makeDockButton(BTN_MODE_CHANGE, T.dock_mode_change);
    changeBtn.style.display = "none";
    changeBtn.addEventListener("click", () => {
      modeChangeRevealUntil = Date.now() + 500;
      const cur = getMode();
      const next = (cur === "ultra") ? "eco" : (cur === "eco" ? "perf" : "ultra");
      applyModeAndNotify(next);
    });

    const infoBtn = makeInfoIcon(getModeInfoText(getMode()));

    let hideTimer = null;
    const show = () => {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = null;
      changeBtn.style.display = "";
    };
    const scheduleHide = () => {
      if (hideTimer) clearTimeout(hideTimer);
      const delay = Math.max(0, modeChangeRevealUntil - Date.now());
      if (delay === 0) {
        if (!wrap.matches(":hover")) changeBtn.style.display = "none";
        return;
      }
      hideTimer = setTimeout(() => {
        if (!wrap.matches(":hover")) changeBtn.style.display = "none";
      }, delay);
    };

    if (Date.now() < modeChangeRevealUntil) show();

    wrap.addEventListener("mouseenter", show);
    wrap.addEventListener("mouseleave", scheduleHide);
    statusBtn.addEventListener("focus", show);
    changeBtn.addEventListener("focus", show);
    infoBtn.addEventListener("focus", show);
    statusBtn.addEventListener("blur", scheduleHide);
    changeBtn.addEventListener("blur", scheduleHide);
    infoBtn.addEventListener("blur", scheduleHide);

    wrap.append(changeBtn, statusBtn, infoBtn);
    return wrap;
  }

  function applyDockProfile(dock) {
    if (!dock) return;
    const perf = (getMode() === "perf");
    dock.dataset.ytcfAnim = perf ? "on" : "off";
  }

  function animateDockIn(dock) {
    if (!dock) return;
    if (dock.dataset.ytcfAnim !== "on") return;
    dock.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0px)" }
      ],
      { duration: 180, easing: "ease-out" }
    );
  }

  function hideDock(dock) {
    if (!dock) return;
    if (dockIsHidden) return;
    dockIsHidden = true;
    dock.style.pointerEvents = "none";
    dock.style.display = "none";
  }

  function showDock(dock, animate = false) {
    if (!dock) return;
    if (!dockIsHidden && dock.style.display === "flex") return;

    dockIsHidden = false;
    dock.style.display = "flex";
    dock.style.pointerEvents = "auto";
    if (animate) animateDockIn(dock);
  }

function buildGeneralRows() {
  const shortsKeys = [KEY.shortsHome, KEY.shortsSearch, KEY.sidebarShorts, KEY.blockShortsPage];
  const lowpopKeys = [KEY.lowpopHome, KEY.lowpopSearch, KEY.lowpopWatch];
  const liveKeys = [KEY.liveHome, KEY.liveSearch, KEY.liveWatch];
  const lowLiveKeys = [KEY.lowpopLiveHome, KEY.lowpopLiveSearch, KEY.lowpopLiveWatch];

  return [
    makeToggleRowGroup({
      actionId: "ytcf-btn-master-shorts-action",
      stateId: "ytcf-btn-master-shorts-state",
      label: T.dock_master_shorts_label || "Remove Shorts entirely",
      actionOn: T.dock_master_shorts_action_on || "Show all Shorts",
      actionOff: T.dock_master_shorts_action_off || "Hide all Shorts",
      infoText: T.dock_master_shorts_info || "Enables all Shorts-related options.",
      isOn: () => getGroupState(shortsKeys),
      onToggle: (next) => {
        setGroupState(shortsKeys, next);
        scheduleRun(true);
      },
    }),
    makeToggleRowGroup({
      actionId: "ytcf-btn-master-news-action",
      stateId: "ytcf-btn-master-news-state",
      label: T.dock_master_news_label || "Hide News",
      actionOn: T.dock_master_news_action_on || "Show News",
      actionOff: T.dock_master_news_action_off || "Hide News",
      infoText: T.dock_master_news_info || "Hides the News section on Home.",
      isOn: () => getBool(KEY.newsHome),
      onToggle: (next) => {
        setBool(KEY.newsHome, next);
        scheduleRun(true);
      },
    }),
    makeToggleRowGroup({
      actionId: "ytcf-btn-master-lowpop-action",
      stateId: "ytcf-btn-master-lowpop-state",
      label: T.dock_master_lowpop_label || "Filter low-pop videos",
      actionOn: T.dock_master_lowpop_action_on || "Show low-pop videos",
      actionOff: T.dock_master_lowpop_action_off || "Hide low-pop videos",
      infoText: T.dock_master_lowpop_info || "Enables low-pop filter everywhere.",
      isOn: () => getGroupState(lowpopKeys),
      onToggle: (next) => {
        setGroupState(lowpopKeys, next);
        if (!next) unhideLowpop();
        scheduleRun(true);
      },
    }),
    makeToggleRowGroup({
      actionId: "ytcf-btn-master-live-action",
      stateId: "ytcf-btn-master-live-state",
      label: T.dock_master_live_label || "Hide livestreams",
      actionOn: T.dock_master_live_action_on || "Show livestreams",
      actionOff: T.dock_master_live_action_off || "Hide livestreams",
      infoText: T.dock_master_live_info || "Enables live hiding everywhere.",
      isOn: () => getGroupState(liveKeys),
      onToggle: (next) => {
        setGroupState(liveKeys, next);
        if (!next) unhideLive();
        resetLiveProcessed();
        scheduleRun(true);
      },
    }),
    makeToggleRowGroup({
      actionId: "ytcf-btn-master-lowlive-action",
      stateId: "ytcf-btn-master-lowlive-state",
      label: T.dock_master_lowlive_label || "Hide low-viewer livestreams",
      actionOn: T.dock_master_lowlive_action_on || "Show low-viewer livestreams",
      actionOff: T.dock_master_lowlive_action_off || "Hide low-viewer livestreams",
      infoText: T.dock_master_lowlive_info || "Enables low-live filter everywhere.",
      isOn: () => getGroupState(lowLiveKeys),
      onToggle: (next) => {
        setGroupState(lowLiveKeys, next);
        if (!next) unhideLowLive();
        resetLowLiveProcessed();
        scheduleRun(true);
      },
    }),
    makeToggleRowGroup({
      actionId: "ytcf-btn-master-header-action",
      stateId: "ytcf-btn-master-header-state",
      label: T.dock_master_header_label || "Header auto-hide (/watch)",
      actionOn: T.dock_master_header_action_on || "Header normal",
      actionOff: T.dock_master_header_action_off || "Header auto",
      infoText: T.dock_master_header_info || "Enable or disable auto-hide header.",
      isOn: () => getBool(KEY.headerHoverWatch),
      onToggle: (next) => {
        setBool(KEY.headerHoverWatch, next);
        bindHeaderMouse();
        applyHeaderHoverNow();
        scheduleRun(true);
      },
    }),
  ];
}

function buildHomeRows() {
    return [
      makeToggleRow({
        actionId: "ytcf-btn-shorts-action",
        stateId: "ytcf-btn-shorts-state",
        key: KEY.shortsHome,
        label: T.dock_shorts_label,
        actionOn: T.dock_shorts_action_on,
        actionOff: T.dock_shorts_action_off,
        infoText: T.dock_shorts_info,
        onToggle: () => {
          scheduleRun(true);
          setTimeout(() => scheduleRun(true), 250);
          setTimeout(() => scheduleRun(true), 900);
          setTimeout(() => scheduleRun(true), 1800);
        },
      }),
      makeToggleRow({
        actionId: "ytcf-btn-news-action",
        stateId: "ytcf-btn-news-state",
        key: KEY.newsHome,
        label: T.dock_news_label,
        actionOn: T.dock_news_action_on,
        actionOff: T.dock_news_action_off,
        infoText: T.dock_news_info,
        onToggle: () => { scheduleRun(true); },
      }),
      makeToggleRow({
        actionId: "ytcf-btn-live-home-action",
        stateId: "ytcf-btn-live-home-state",
        key: KEY.liveHome,
        label: T.dock_live_home_label || "Livestreams hidden (Home)",
        actionOn: T.dock_live_home_action_on || "Show livestreams (Home)",
        actionOff: T.dock_live_home_action_off || "Hide livestreams (Home)",
        infoText: T.dock_live_home_info || "Hides live streams on the Home feed.",
        onToggle: (next) => {
          if (!next) unhideLive();
          resetLiveProcessed();
          scheduleRun(true);
        },
      }),
      makeToggleRow({
        actionId: "ytcf-btn-lowlive-home-action",
        stateId: "ytcf-btn-lowlive-home-state",
        key: KEY.lowpopLiveHome,
        label: T.dock_lowlive_home_label || "Low-viewer livestreams (Home)",
        actionOn: T.dock_lowlive_home_action_on || "Show low-viewer livestreams",
        actionOff: T.dock_lowlive_home_action_off || "Hide low-viewer livestreams",
        infoText: T.dock_lowlive_home_info || "Hides live streams under the viewer threshold on Home.",
        onToggle: (next) => {
          if (!next) unhideLowLive();
          resetLowLiveProcessed();
          scheduleRun(true);
        },
      }),
      makeToggleRow({
        actionId: "ytcf-btn-lowpop-home-action",
        stateId: "ytcf-btn-lowpop-home-state",
        key: KEY.lowpopHome,
        label: T.dock_lowpop_home_label,
        actionOn: T.dock_lowpop_home_action_on,
        actionOff: T.dock_lowpop_home_action_off,
        infoText: T.dock_lowpop_home_info,
        onToggle: (next) => {
          if (!next) unhideLowpop();
          scheduleRun(true);
          showToast(next ? T.toast_btn_home_on : T.toast_btn_home_off, next ? "on" : "off");
        },
      }),
    ];
}

function buildSearchRows() {
  return [
    makeToggleRow({
      actionId: "ytcf-btn-shorts-search-action",
      stateId: "ytcf-btn-shorts-search-state",
      key: KEY.shortsSearch,
      label: T.dock_shorts_search_label,
      actionOn: T.dock_shorts_search_action_on,
      actionOff: T.dock_shorts_search_action_off,
      infoText: T.dock_shorts_search_info,
      onToggle: () => { scheduleRun(true); },
    }),
    makeToggleRow({
      actionId: "ytcf-btn-lowpop-search-action",
      stateId: "ytcf-btn-lowpop-search-state",
      key: KEY.lowpopSearch,
      label: T.dock_lowpop_search_label,
      actionOn: T.dock_lowpop_search_action_on,
      actionOff: T.dock_lowpop_search_action_off,
      infoText: T.dock_lowpop_search_info,
      onToggle: (next) => {
        if (!next) unhideLowpop();
        scheduleRun(true);
      },
    }),
    makeToggleRow({
      actionId: "ytcf-btn-live-search-action",
      stateId: "ytcf-btn-live-search-state",
      key: KEY.liveSearch,
      label: T.dock_live_search_label || "Livestreams hidden (Search)",
      actionOn: T.dock_live_search_action_on || "Show livestreams (Search)",
      actionOff: T.dock_live_search_action_off || "Hide livestreams (Search)",
      infoText: T.dock_live_search_info || "Hides live streams in Search.",
      onToggle: (next) => {
        if (!next) unhideLive();
        resetLiveProcessed();
        scheduleRun(true);
      },
    }),
    makeToggleRow({
      actionId: "ytcf-btn-lowlive-search-action",
      stateId: "ytcf-btn-lowlive-search-state",
      key: KEY.lowpopLiveSearch,
      label: T.dock_lowlive_search_label || "Low-viewer livestreams (Search)",
      actionOn: T.dock_lowlive_search_action_on || "Show low-viewer livestreams",
      actionOff: T.dock_lowlive_search_action_off || "Hide low-viewer livestreams",
      infoText: T.dock_lowlive_search_info || "Hides live streams under the viewer threshold in Search.",
      onToggle: (next) => {
        if (!next) unhideLowLive();
        resetLowLiveProcessed();
        scheduleRun(true);
      },
    }),
  ];
}

function buildSidebarRows() {
  return [
    makeToggleRow({
      actionId: "ytcf-btn-sidebar-shorts-action",
      stateId: "ytcf-btn-sidebar-shorts-state",
      key: KEY.sidebarShorts,
      label: T.dock_sidebar_shorts_label,
      actionOn: T.dock_sidebar_shorts_action_on,
      actionOff: T.dock_sidebar_shorts_action_off,
      infoText: T.dock_sidebar_shorts_info,
      onToggle: () => { scheduleRun(true); },
    }),
  ];
}
function buildWatchRows() {
    return [
      makeToggleRow({
        actionId: "ytcf-btn-lowpop-watch-action",
        stateId: "ytcf-btn-lowpop-watch-state",
        key: KEY.lowpopWatch,
        label: T.dock_lowpop_watch_label,
        actionOn: T.dock_lowpop_watch_action_on,
        actionOff: T.dock_lowpop_watch_action_off,
        infoText: T.dock_lowpop_watch_info,
        onToggle: (next) => {
          if (!next) unhideLowpop();
          scheduleRun(true);
          showToast(next ? T.toast_btn_watch_on : T.toast_btn_watch_off, next ? "on" : "off");
        },
      }),
      makeToggleRow({
        actionId: "ytcf-btn-header-action",
        stateId: "ytcf-btn-header-state",
        key: KEY.headerHoverWatch,
        label: T.dock_header_label,
        actionOn: T.dock_header_action_on,
        actionOff: T.dock_header_action_off,
        infoText: T.dock_header_info,
        onToggle: (next) => {
          bindHeaderMouse();
          applyHeaderHoverNow();
          scheduleRun(true);
          showToast(next ? T.toast_header_on : T.toast_header_off, next ? "on" : "off");
        },
      }),
      makeToggleRow({
        actionId: "ytcf-btn-autolike-subs-action",
        stateId: "ytcf-btn-autolike-subs-state",
        key: KEY.autoLikeSubs,
        label: T.dock_autolike_subs_label || "Auto-like subscribed channels",
        actionOn: T.dock_autolike_subs_action_on || "Disable auto-like",
        actionOff: T.dock_autolike_subs_action_off || "Enable auto-like",
        infoText: T.dock_autolike_subs_info || "Automatically likes videos from subscribed channels.",
        onToggle: () => {
          scheduleRun(true);
          autoLikeSubscribedWatch();
        },
      }),
      makeToggleRow({
        actionId: "ytcf-btn-live-watch-action",
        stateId: "ytcf-btn-live-watch-state",
        key: KEY.liveWatch,
        label: T.dock_live_watch_label || "Livestreams hidden (/watch)",
        actionOn: T.dock_live_watch_action_on || "Show livestreams (/watch)",
        actionOff: T.dock_live_watch_action_off || "Hide livestreams (/watch)",
        infoText: T.dock_live_watch_info || "Hides live recommendations on /watch.",
        onToggle: (next) => {
          if (!next) unhideLive();
          resetLiveProcessed();
          scheduleRun(true);
        },
      }),
      makeToggleRow({
        actionId: "ytcf-btn-lowlive-watch-action",
        stateId: "ytcf-btn-lowlive-watch-state",
        key: KEY.lowpopLiveWatch,
        label: T.dock_lowlive_watch_label || "Low-viewer livestreams (/watch)",
        actionOn: T.dock_lowlive_watch_action_on || "Show low-viewer livestreams",
        actionOff: T.dock_lowlive_watch_action_off || "Hide low-viewer livestreams",
        infoText: T.dock_lowlive_watch_info || "Hides live streams under the viewer threshold on /watch.",
        onToggle: (next) => {
          if (!next) unhideLowLive();
          resetLowLiveProcessed();
          scheduleRun(true);
        },
      }),
    ];
}

function buildAdvancedRows() {
  return [
    makeToggleRow({
      actionId: "ytcf-btn-block-shorts-action",
      stateId: "ytcf-btn-block-shorts-state",
      key: KEY.blockShortsPage,
      label: T.dock_block_shorts_label,
      actionOn: T.dock_block_shorts_action_on,
      actionOff: T.dock_block_shorts_action_off,
      infoText: T.dock_block_shorts_info,
      onToggle: () => { maybeRedirectShortsPage(); scheduleRun(true); },
    }),
    makeToggleRow({
      actionId: "ytcf-btn-float-buttons-action",
      stateId: "ytcf-btn-float-buttons-state",
      key: KEY.floatButtons,
      label: T.dock_float_buttons_label,
      actionOn: T.dock_float_buttons_action_on,
      actionOff: T.dock_float_buttons_action_off,
      infoText: T.dock_float_buttons_info,
      onToggle: () => { scheduleRun(true); },
    }),
    makeActionRow({
      actionId: "ytcf-btn-autolike-blocklist-reset",
      stateId: "ytcf-btn-autolike-blocklist-state",
      label: T.dock_autolike_blocklist_label || "Auto-like blocklist",
      actionLabel: T.dock_autolike_blocklist_action || "Reset blocklist",
      infoText: T.dock_autolike_blocklist_info || "Clears the list of videos you manually unliked/disliked.",
      count: () => getAutoLikeBlockCount(),
      onAction: () => {
        resetAutoLikeBlocklist();
        scheduleRun(true);
      },
    }),
    makeMinViewsRow(),
    makeMinLiveViewsRow(),
    makeLanguageRow(),
  ];
}

  function buildSubmenuButtons(highlightTarget) {
    return [
      makeMenuAccessButton(
        BTN_MENU_GENERAL,
        T.dock_menu_general_label || "General",
        T.dock_menu_general_info || "Global shortcuts.",
        () => {
          dockSubmenu = "general";
          forceRenderDockNow();
        },
        highlightTarget === "general"
      ),
      makeMenuAccessButton(
        BTN_MENU_HOME,
        T.dock_menu_home_label,
        T.dock_menu_home_info,
        () => {
        dockSubmenu = "home";
        forceRenderDockNow();
      },
      highlightTarget === "home"
    ),
    makeMenuAccessButton(
      BTN_MENU_SEARCH,
      T.dock_menu_search_label,
      T.dock_menu_search_info,
      () => {
        dockSubmenu = "search";
        forceRenderDockNow();
      },
      highlightTarget === "search"
    ),
    makeMenuAccessButton(
      BTN_MENU_SIDEBAR,
      T.dock_menu_sidebar_label,
      T.dock_menu_sidebar_info,
      () => {
        dockSubmenu = "sidebar";
        forceRenderDockNow();
      },
      highlightTarget === "sidebar"
    ),
    makeMenuAccessButton(
      BTN_MENU_WATCH,
      T.dock_menu_watch_label,
      T.dock_menu_watch_info,
      () => {
        dockSubmenu = "watch";
        forceRenderDockNow();
      },
      highlightTarget === "watch"
    ),
    makeMenuAccessButton(
      BTN_MENU_ADV,
      T.dock_menu_adv_label,
      T.dock_menu_adv_info,
      () => {
        dockSubmenu = "advanced";
        forceRenderDockNow();
      }
    ),
  ];
}

  function scheduleShowDockAfterExitFS(dock) {
    if (fsRestoreTimer) clearTimeout(fsRestoreTimer);
    fsRestoreTimer = null;

    const delay = (getMode() === "ultra") ? 45000 : (getMode() === "eco" ? 30000 : 10000);
    dockWasFullscreen = true;

    fsRestoreTimer = setTimeout(() => {
      fsRestoreTimer = null;
      if (isFullscreenNow()) return;

      dockWasFullscreen = false;
      lastDockKey = "";
      scheduleRun(true);
    }, delay);
  }

  function forceRenderDockNow() {
    lastDockKey = "";
    dockWasFullscreen = false;
    if (document.body) renderDock();
  }

  function renderDock() {
    if (!document.body) return;

    // ensure scroll listener exists (for ECO mode especially)
    bindScrollForGoTopOnce();

    if (!getBool(KEY.floatButtons)) {
      document.getElementById(DOCK_ID)?.remove();
      lastDockKey = "";
      dockIsHidden = false;
      return;
    }

    const dock = ensureDock();
    applyDockProfile(dock);
    ensureDockIdleListeners(dock);

    const onHome = isHome();
    const onWatch = isWatch();
    const fs = isFullscreenNow();

    const highlightTarget = isHome() ? "home" : (isSearch() ? "search" : (isWatch() ? "watch" : null));
    const stateKey = [
      "v4",
      getMode(),
      LANG,
      uiCollapsed ? "c1" : "c0",
      uiCollapsedWatch ? "cw1" : "cw0",
      fs ? "fs1" : "fs0",
      onHome ? "h1" : "h0",
      onWatch ? "w1" : "w0",
      getBool(KEY.shortsHome) ? "sh1" : "sh0",
      getBool(KEY.lowpopHome) ? "lh1" : "lh0",
      getBool(KEY.lowpopWatch) ? "lw1" : "lw0",
      getBool(KEY.liveHome) ? "lvh1" : "lvh0",
      getBool(KEY.liveSearch) ? "lvs1" : "lvs0",
      getBool(KEY.liveWatch) ? "lvw1" : "lvw0",
      getBool(KEY.lowpopLiveHome) ? "llh1" : "llh0",
      getBool(KEY.lowpopLiveSearch) ? "lls1" : "lls0",
      getBool(KEY.lowpopLiveWatch) ? "llw1" : "llw0",
      getBool(KEY.headerHoverWatch) ? "hh1" : "hh0",
      getBool(KEY.autoLikeSubs) ? "al1" : "al0",
      `bl-${getAutoLikeBlockCount()}`,
      `mv-${getMinViews()}`,
      `mlv-${getMinLiveViews()}`,
      dockSubmenu ? `sm-${dockSubmenu}` : "sm0",
      // ✅ new visibility bit so dock updates correctly without full rerenders
      (shouldShowGoTop() ? "gt1" : "gt0"),
    ].join("|");

    if (fs) {
      dockWasFullscreen = true;
      clearDockIdleTimers();
      if (fsRestoreTimer) clearTimeout(fsRestoreTimer);
      fsRestoreTimer = null;
      hideDock(dock);
      lastDockKey = stateKey;
      return;
    }

    if (dockWasFullscreen) {
      lastDockKey = stateKey;
      return;
    }

    if (stateKey === lastDockKey) return;
    lastDockKey = stateKey;

    showDock(dock, getMode() === "perf");

    if (dockSubmenu) {
      clearDockIdleTimers();
      setDockDim(dock, false);

      const items = [];
      if (shouldShowGoTop()) {
        const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
        applyGoTopHover(goTopBtn);
        goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
        items.push(goTopBtn);
      }

      const backBtn = makeDockButton(BTN_MENU_BACK, T.dock_menu_back);
      backBtn.addEventListener("click", () => {
        dockSubmenu = null;
        forceRenderDockNow();
      });

      const submenuTitles = {
        general: T.dock_menu_general_title || "General:",
        home: T.dock_menu_home_title,
        search: T.dock_menu_search_title,
        sidebar: T.dock_menu_sidebar_title,
        watch: T.dock_menu_watch_title,
        advanced: T.dock_menu_adv_title,
      };
      const titleText = submenuTitles[dockSubmenu] || T.dock_menu_adv_title;
      const titleBtn = makeDockButton(BTN_MENU_TITLE, titleText);
      titleBtn.setAttribute("aria-disabled", "true");
      titleBtn.style.pointerEvents = "none";
      titleBtn.style.cursor = "default";
      titleBtn.style.background = "rgba(0,0,0,0.62)";
      titleBtn.style.color = "#ffffff";
      titleBtn.style.border = "1px solid rgba(255,255,255,0.18)";
      titleBtn.style.fontWeight = "700";
      titleBtn.style.opacity = "1";

      items.push(backBtn, titleBtn);
      const submenuRows = {
        general: buildGeneralRows(),
        home: buildHomeRows(),
        search: buildSearchRows(),
        sidebar: buildSidebarRows(),
        watch: buildWatchRows(),
        advanced: buildAdvancedRows(),
      };
      items.push(...(submenuRows[dockSubmenu] || []));

      dock.replaceChildren(...items);
      return;
    }

    // ===== HOME (global collapse/expand) =====
    if (onHome) {
      if (uiCollapsed) {
        clearDockIdleTimers();
        setDockDim(dock, false);

        const expand = makeDockButton(BTN_EXPAND, "");
        applyGearHover(expand);

        expand.addEventListener("click", () => {
          setUiCollapsed(false);
          forceRenderDockNow();
          scheduleRun(true);
        });

        // ✅ NEW: go-top button above ⚙️ (only if scrolled enough)
        if (shouldShowGoTop()) {
          const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
          applyGoTopHover(goTopBtn);
          goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
          dock.replaceChildren(goTopBtn, expand);
        } else {
          dock.replaceChildren(expand);
        }
        return;
      }

      const collapse = makeDockButton(BTN_COLLAPSE, T.dock_collapse);
      collapse.addEventListener("click", () => {
        setUiCollapsed(true);
        forceRenderDockNow();
      });

      const modeGroup = makeModeStatusGroup();
      const items = [];
      if (shouldShowGoTop()) {
        const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
        applyGoTopHover(goTopBtn);
        goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
        items.push(goTopBtn);
      }
      items.push(collapse, modeGroup, ...buildSubmenuButtons(highlightTarget));
      dock.replaceChildren(...items);
      armDockIdle(dock, "home");
      if (getMode() === "perf") animateDockIn(dock);
      return;
    }

    // ===== WATCH (local collapse/expand + header auto toggle) =====
    if (onWatch) {
      // When collapsed on watch => show only Expand (+ go-top above if needed)
      if (uiCollapsedWatch) {
        const expandW = makeDockButton(BTN_WATCH_EXPAND, "");
        applyGearHover(expandW);
        expandW.addEventListener("click", () => {
          setUiCollapsedWatch(false);
          forceRenderDockNow();
          scheduleRun(true);
        });

        clearDockIdleTimers();
        setDockDim(dock, false);

        // ✅ NEW: go-top button above ⚙️ (only if scrolled enough)
        if (shouldShowGoTop()) {
          const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
          applyGoTopHover(goTopBtn);
          goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
          dock.replaceChildren(goTopBtn, expandW);
        } else {
          dock.replaceChildren(expandW);
        }
        return;
      }

      // Show "Ranger" + header toggle + lowpop toggle (watch)
      const collapseW = makeDockButton(BTN_WATCH_COLLAPSE, T.dock_collapse);
      collapseW.addEventListener("click", () => {
        setUiCollapsedWatch(true);
        forceRenderDockNow();
      });

      const modeGroup = makeModeStatusGroup();
      const items = [];
      if (shouldShowGoTop()) {
        const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
        applyGoTopHover(goTopBtn);
        goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
        items.push(goTopBtn);
      }
      items.push(collapseW, modeGroup, ...buildSubmenuButtons(highlightTarget));
      dock.replaceChildren(...items);
      armDockIdle(dock, "watch");
      if (getMode() === "perf") animateDockIn(dock);
      return;
    }

    // ===== SEARCH (main menu fallback) =====
    if (isSearch()) {
      const modeGroup = makeModeStatusGroup();
      const items = [];
      if (shouldShowGoTop()) {
        const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
        applyGoTopHover(goTopBtn);
        goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
        items.push(goTopBtn);
      }
      items.push(modeGroup, ...buildSubmenuButtons(highlightTarget));
      dock.replaceChildren(...items);
      armDockIdle(dock, "home");
      if (getMode() === "perf") animateDockIn(dock);
      return;
    }

    // other routes => empty dock
    dock.replaceChildren();
  }

  /* =========================================================
   * RUNNER (Unified) — multi-pass after navigation
   * ========================================================= */
  let scheduled = false;
  let deferredRunTimer = null;

  function deferHeavyRun() {
    if (deferredRunTimer) clearTimeout(deferredRunTimer);
    const delay = isUltraMode() ? 600 : (getMode() === "eco" ? 400 : 250);
    deferredRunTimer = setTimeout(() => {
      deferredRunTimer = null;
      if (!isSearchInteractionActive()) scheduleRun(true);
    }, delay);
  }

  function scheduleRun(force = false) {
    if (scheduled && !force) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      run();
    }, force ? 0 : (isUltraMode() ? 220 : 90));
  }

  function runHome() {
    const home = homeContainer();
    if (!home) return;
    if (isSearchInteractionActive()) {
      deferHeavyRun();
      return;
    }

    if (getBool(KEY.shortsHome)) hideShortsShelvesWithin(home, "home");
    if (getBool(KEY.newsHome)) hideNewsShelfOnHome(home);
    if (getBool(KEY.liveHome)) scanHomeLive(home);
    if (!isUltraMode() && getBool(KEY.lowpopLiveHome)) scanHomeLowLive(home);
    if (!isUltraMode() && getBool(KEY.lowpopHome)) scanHomeLowpop(home);
  }

  function runSearch() {
    const search = searchContainer();
    if (!search) return;
    if (isSearchInteractionActive()) {
      deferHeavyRun();
      return;
    }
    if (getBool(KEY.shortsSearch)) {
      hideShortsShelvesWithin(search, "search");
      hideShortsVideoResultsInSearch(search);
    }
    if (getBool(KEY.liveSearch)) scanSearchLive(search);
    if (!isUltraMode() && getBool(KEY.lowpopLiveSearch)) scanSearchLowLive(search);
    if (!isUltraMode() && getBool(KEY.lowpopSearch)) scanSearchLowpop(search);
  }

  function runWatch() {
    const watch = watchContainer();
    if (!watch) return;
    const deferHeavy = isSearchInteractionActive();

    bindWatchVideoIdObserver();
    handleWatchVideoChange();
    autoLikeSubscribedWatch();

    if (getBool(KEY.liveWatch) && !deferHeavy) scanWatchLive(watch);
    if (!isUltraMode() && getBool(KEY.lowpopLiveWatch) && !deferHeavy) scanWatchLowLive(watch);
    if (!isUltraMode() && getBool(KEY.lowpopWatch) && !deferHeavy) scanWatchLowpop(watch);
    if (deferHeavy) deferHeavyRun();

    // ✅ apply header hover (watch only)
    if (!isUltraMode()) {
      bindHeaderMouse();
      applyHeaderHoverNow();
    } else if (headerHoverEnabled) {
      headerDisable();
    }
  }

  function runUI() {
    if (isSearchInteractionActive()) {
      deferHeavyRun();
      return;
    }
    if (getBool(KEY.sidebarShorts)) hideSidebarShortsEntry();
  }

  function run() {
    maybeRedirectShortsPage();

    if (isHome()) {
      if (getMode() === "perf") runHome();
      else ecoEnqueue(homeContainer(), runHome);
    }

    if (isSearch()) {
      if (getMode() === "perf") runSearch();
      else ecoEnqueue(searchContainer(), runSearch);
    }

    if (isWatch()) {
      if (getMode() === "perf") runWatch();
      else ecoEnqueue(watchContainer(), runWatch);
    } else {
      // ✅ restore header defaults when leaving /watch
      if (headerHoverEnabled) headerDisable();
    }

    if (getMode() === "perf") runUI();
    else ecoEnqueue(document, runUI);

    if (document.body) {
      renderDock();
    }
  }

  /* =========================================================
   * OBSERVER (Perf) + Eco click nudge
   * ========================================================= */
  let mo = null;
  let ecoClickBound = false;

  function disconnectObserver() {
    if (!mo) return;
    try { mo.disconnect(); } catch (_) {}
    mo = null;
    if (deferredRunTimer) {
      clearTimeout(deferredRunTimer);
      deferredRunTimer = null;
    }
  }

  function shouldObserve() {
    if (getMode() !== "perf") return false;

    const needHome = isHome() && (
      getBool(KEY.shortsHome) ||
      getBool(KEY.newsHome) ||
      getBool(KEY.lowpopHome) ||
      getBool(KEY.liveHome) ||
      getBool(KEY.lowpopLiveHome)
    );
    const needSearch = isSearch() && (
      getBool(KEY.shortsSearch) ||
      getBool(KEY.lowpopSearch) ||
      getBool(KEY.liveSearch) ||
      getBool(KEY.lowpopLiveSearch)
    );
    const needWatch = isWatch() && (
      getBool(KEY.lowpopWatch) ||
      getBool(KEY.headerHoverWatch) ||
      getBool(KEY.autoLikeSubs) ||
      getBool(KEY.liveWatch) ||
      getBool(KEY.lowpopLiveWatch)
    );
    const needUI = getBool(KEY.sidebarShorts);

    return needHome || needSearch || needWatch || needUI;
  }

  function connectObserver() {
    if (!shouldObserve()) {
      disconnectObserver();
      return;
    }
    if (mo) return;

    mo = new MutationObserver(() => {
      if (isSearchInteractionActive()) {
        deferHeavyRun();
        return;
      }
      scheduleRun(false);
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function bindEcoClickNudge() {
    if (ecoClickBound) return;
    ecoClickBound = true;

    document.addEventListener("click", (e) => {
      if (getMode() === "perf") return;
      const tEl = e.target;
      if (!tEl) return;
      const isSidebarArea = !!tEl.closest?.("ytd-guide-renderer, ytd-mini-guide-renderer, tp-yt-paper-listbox");
      if (isSidebarArea) setTimeout(() => scheduleRun(true), 80);
    }, true);
  }

  function applyMode() {
    resetEcoQueue();
    bindEcoClickNudge();
    if (isUltraMode()) enterUltraMode();
    else exitUltraMode();

    if (getMode() === "perf") connectObserver();
    else disconnectObserver();

    lastDockKey = "";
    scheduleRun(true);
  }

  /* =========================================================
   * MENU (Categorized)
   * ========================================================= */
  let menuIds = [];

  function clearMenu() {
    for (const id of menuIds) {
      try { GM_unregisterMenuCommand(id); } catch (_) {}
    }
    menuIds = [];
  }

  function addHeader(text) {
    menuIds.push(GM_registerMenuCommand(`— ${text} —`, () => {}));
  }

  function addToggle(label, key, onChange) {
    const v = getBool(key);
    menuIds.push(GM_registerMenuCommand(`${statusLabel(v)} ${label}`, () => {
      setBool(key, !v);
      registerMenu();
      onChange?.(!v, v);
    }));
  }

  function registerMenu() {
    clearMenu();

    addHeader(T.sec_global);
    addToggle(T.opt_float_buttons, KEY.floatButtons, () => {
      showToast(T.toast_updated, "info");
      forceRenderDockNow();
      scheduleRun(true);
    });

    addHeader(T.dock_lang_label);
    const currentLang = getLangSetting();
    const options = ["auto", ...Object.keys(I18N)];
    for (const code of options) {
      const isCurrent = code === currentLang;
      const label = isCurrent ? `[*] ${getLangDisplayName(code)}` : `[ ] ${getLangDisplayName(code)}`;
      menuIds.push(GM_registerMenuCommand(label, () => {
        setLangSetting(code);
        applyLanguage();
        registerMenu();
        forceRenderDockNow();
        scheduleRun(true);
      }));
    }

  }

  /* =========================================================
   * SPA NAVIGATION — multi-pass + de-dupe
   * ========================================================= */
  let lastNavUrl = "";

  function onNavigate() {
    const url = location.href;
    if (url === lastNavUrl) return;
    lastNavUrl = url;

    applyLanguage();
    maybeRedirectShortsPage();
    applyMode();
    registerMenu();
    dockSubmenu = null;
    // ✅ keep header in sync with route
    bindHeaderMouse();
    applyHeaderHoverNow();

    if (isWatch()) {
      bindWatchVideoIdObserver();
      handleWatchVideoChange();
    } else {
      lastWatchVideoId = null;
      resetAutoLikeState(null);
      stopAutoLikeWatchObserver();
      bindWatchVideoIdObserver();
    }

    scheduleRun(true);
    if (!isUltraMode()) {
      setTimeout(() => scheduleRun(true), 250);
      setTimeout(() => scheduleRun(true), 900);
      setTimeout(() => scheduleRun(true), 1800);
    }
  }

     /* =========================================================
   * BOOT
   * ========================================================= */
  function boot() {
    try {
      registerMenu();
      applyMode();
      onNavigate();

      // ensure dock exists early (and binds scroll listener via renderDock)
      scheduleRun(true);

      const onFsChange = () => {
        const dock = document.getElementById(DOCK_ID);
        if (!dock) return;

        if (isFullscreenNow()) {
          dockWasFullscreen = true;
          if (fsRestoreTimer) clearTimeout(fsRestoreTimer);
          fsRestoreTimer = null;
          hideDock(dock);
        } else {
          scheduleShowDockAfterExitFS(dock);
        }
      };

      document.addEventListener("fullscreenchange", onFsChange);
      document.addEventListener("webkitfullscreenchange", onFsChange);

      window.addEventListener("yt-navigate-finish", onNavigate, true);
      window.addEventListener("yt-navigate-end", onNavigate, true);
      window.addEventListener("yt-page-data-updated", onNavigate, true);
      window.addEventListener("popstate", onNavigate, true);
    } catch (e) {
      // si une erreur empêche tout, au moins on le voit dans la console
      console.error("[YTCF] boot error:", e);
    }
  }

  // ✅ IMPORTANT : appel réel du boot (sinon aucun menu / aucun bouton)
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

