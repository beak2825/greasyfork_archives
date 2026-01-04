// ==UserScript==
// @name         Torn Radial Search Library
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Search functionality for Torn Radial Menu
// @author       Sensimillia (2168012)
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ==================== SEARCH HANDLER CLASS ====================
    class SearchHandler {
        constructor() {
            this.history = this.loadHistory();
            this.maxHistory = 20;
        }

        loadHistory() {
            try {
                const stored = localStorage.getItem('tornRadialSearchHistory');
                return stored ? JSON.parse(stored) : [];
            } catch(e) {
                console.error('Failed to load search history:', e);
                return [];
            }
        }

        addToHistory(query, url, type) {
            const entry = {
                query: query,
                url: url,
                type: type,
                timestamp: Date.now()
            };

            this.history = this.history.filter(h => h.query !== query);
            this.history.unshift(entry);
            this.history = this.history.slice(0, this.maxHistory);
            
            try {
                localStorage.setItem('tornRadialSearchHistory', JSON.stringify(this.history));
            } catch(e) {
                console.error('Failed to save search history:', e);
            }
        }

        getHistory() {
            return this.history;
        }

        clearHistory() {
            this.history = [];
            try {
                localStorage.removeItem('tornRadialSearchHistory');
            } catch(e) {
                console.error('Failed to clear search history:', e);
            }
        }

        async search(query) {
            const results = {
                players: [],
                items: [],
                pages: [],
                factions: [],
                companies: []
            };

            const queryLower = query.toLowerCase().trim();

            // Player ID search
            if (/^\d+$/.test(query)) {
                results.players.push({
                    name: `Player ID: ${query}`,
                    url: `/profiles.php?XID=${query}`,
                    icon: '👤',
                    type: 'player'
                });
            }

            // Item keywords
            const itemKeywords = ['xanax', 'ecstasy', 'armor', 'weapon', 'flower', 'plushie', 'blood', 'can', 'drug', 'booze'];
            if (itemKeywords.some(k => queryLower.includes(k))) {
                results.items.push({
                    name: `Search Items: "${query}"`,
                    url: `/imarket.php#/p=shop&searchname=${encodeURIComponent(query)}`,
                    icon: '🛒',
                    type: 'item'
                });
            }

            // Common pages
            const pageMatches = [
                { keywords: ['gym', 'train'], name: 'Gym', url: '/gym.php', icon: '💪' },
                { keywords: ['travel', 'fly', 'airport'], name: 'Travel', url: '/travel.php', icon: '✈️' },
                { keywords: ['item', 'inventory'], name: 'Items', url: '/item.php', icon: '🎒' },
                { keywords: ['bazaar', 'baz'], name: 'Bazaar', url: '/bazaar.php', icon: '🏪' },
                { keywords: ['faction', 'fac'], name: 'Faction', url: '/factions.php', icon: '⚔️' },
                { keywords: ['crime', 'oc'], name: 'Crimes', url: '/crimes.php', icon: '🔫' },
                { keywords: ['hospital', 'hosp'], name: 'Hospital', url: '/hospital.php', icon: '🏥' },
                { keywords: ['mission'], name: 'Missions', url: '/loader.php?sid=missions', icon: '🎯' },
                { keywords: ['auction'], name: 'Auctions', url: '/auctions.php', icon: '🔨' },
                { keywords: ['message', 'mail'], name: 'Messages', url: '/messages.php', icon: '💬' },
                { keywords: ['forum'], name: 'Forums', url: '/forums.php', icon: '💭' },
                { keywords: ['city'], name: 'City', url: '/city.php', icon: '🏙️' },
                { keywords: ['company', 'job'], name: 'Company', url: '/companies.php', icon: '🏢' },
                { keywords: ['property', 'properties'], name: 'Properties', url: '/properties.php', icon: '🏘️' },
                { keywords: ['attack', 'fight'], name: 'Attack Log', url: '/attacklog.php', icon: '⚡' },
                { keywords: ['bounty', 'bounties'], name: 'Bounties', url: '/bounties.php', icon: '💀' },
                { keywords: ['war'], name: 'War', url: '/war.php', icon: '💣' },
                { keywords: ['jail'], name: 'Jail', url: '/jail.php', icon: '🔒' },
                { keywords: ['newspaper', 'news'], name: 'Newspaper', url: '/newspaper.php', icon: '📰' },
                { keywords: ['home'], name: 'Home', url: '/index.php', icon: '🏠' },
                { keywords: ['points', 'refill'], name: 'Points Building', url: '/pointsbuild.php', icon: '⭐' }
            ];

            pageMatches.forEach(match => {
                if (match.keywords.some(k => queryLower.includes(k))) {
                    results.pages.push({
                        name: match.name,
                        url: match.url,
                        icon: match.icon,
                        type: 'page'
                    });
                }
            });

            // Default player search
            if (results.players.length === 0 && results.items.length === 0 && results.pages.length === 0 && query.length > 2) {
                results.players.push({
                    name: `Search Player: "${query}"`,
                    url: `/profiles.php?XID=${query}`,
                    icon: '👤',
                    type: 'player'
                });
            }

            return results;
        }
    }

    // ==================== EXPORT ====================
    window.TornRadialSearch = {
        SearchManager: new SearchHandler()
    };

})();