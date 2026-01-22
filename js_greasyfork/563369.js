// ==UserScript==
// @name         Furvilla Moderation Templates
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      2.0
// @description  Furvilla moderation templates with rule references
// @match        https://www.furvilla.com/message/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563369/Furvilla%20Moderation%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/563369/Furvilla%20Moderation%20Templates.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .fv-mod-panel {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 0;
            margin: 20px 0;
            font-family: sans-serif;
            font-size: 14px;
            color: #333;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .fv-mod-header {
            background: #f8f8f8;
            border-bottom: 1px solid #ddd;
            padding: 15px;
            margin: 0;
            font-weight: bold;
            text-align: left;
            font-size: 18px;
        }

        .fv-mod-section {
            padding: 15px;
        }

        .fv-mod-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 16px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }

        .fv-mod-select,
        .fv-mod-input,
        .fv-mod-textarea {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background: #fff;
            color: #333;
            font-family: sans-serif;
            font-size: 14px;
            box-sizing: border-box;
        }

        .fv-mod-select {
            height: 36px;
        }

        .fv-mod-textarea {
            min-height: 60px;
            resize: vertical;
        }

        .fv-mod-btn {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #4a90e2;
            border-radius: 3px;
            background: #4a90e2;
            color: #fff;
            font-family: sans-serif;
            font-size: 14px;
            cursor: pointer;
            font-weight: bold;
        }

        .fv-mod-btn:hover {
            background: #3a80d2;
        }

        .fv-mod-btn.secondary {
            background: #666;
            border-color: #666;
        }

        .fv-mod-btn.secondary:hover {
            background: #555;
        }

        .fv-mod-btn.tertiary {
            background: #28a745;
            border-color: #28a745;
        }

        .fv-mod-btn.tertiary:hover {
            background: #218838;
        }

        .fv-mod-btn.quaternary {
            background: #ffc107;
            border-color: #ffc107;
            color: #212529;
        }

        .fv-mod-btn.quaternary:hover {
            background: #e0a800;
        }

        .fv-mod-preview {
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 10px;
            margin-top: 10px;
            font-size: 12px;
            max-height: 250px;
            overflow-y: auto;
            white-space: pre-wrap;
            font-family: monospace;
            line-height: 1.4;
        }

        .fv-mod-status {
            font-size: 12px;
            text-align: center;
            margin-top: 8px;
            min-height: 16px;
            color: #666;
        }

        .fv-mod-label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .fv-mod-checkbox-group {
            margin-bottom: 10px;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #eee;
            padding: 8px;
            border-radius: 3px;
        }

        .fv-mod-checkbox {
            margin-right: 8px;
            margin-bottom: 6px;
        }

        .fv-mod-rule-label {
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
        }

        .fv-mod-rule-section {
            margin-bottom: 15px;
        }

        .fv-mod-combined-reason {
            background: #f0f7ff;
            border: 1px solid #cce0ff;
            border-radius: 3px;
            padding: 8px;
            margin-top: 10px;
            font-size: 13px;
        }

        .fv-mod-rule-reference {
            background: #fff8e1;
            border: 1px solid #ffecb3;
            border-radius: 3px;
            padding: 8px;
            margin-top: 10px;
            font-size: 12px;
            font-style: italic;
            display: none;
        }

        .fv-mod-rule-ref-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
        }

        .fv-mod-collapsible {
            cursor: pointer;
            padding: 10px;
            background: #f0f0f0;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            border-radius: 3px;
            font-weight: bold;
        }

        .fv-mod-collapsible:hover {
            background: #e0e0e0;
        }

        .fv-mod-collapsible-content {
            padding: 0 10px;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }

        .fv-mod-collapsible-content.expanded {
            max-height: 5000px;
        }

        .fv-mod-btn-group {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }

        .fv-mod-btn-group .fv-mod-btn {
            flex: 1;
        }

        .fv-mod-saved-names {
            margin-top: 10px;
            max-height: 100px;
            overflow-y: auto;
            border: 1px solid #eee;
            padding: 8px;
            border-radius: 3px;
            display: none;
        }

        .fv-mod-saved-name-item {
            padding: 5px;
            margin: 2px 0;
            background: #f8f9fa;
            border-radius: 3px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .fv-mod-saved-name-item:hover {
            background: #e9ecef;
        }

        .fv-mod-saved-name-text {
            flex: 1;
        }

        .fv-mod-saved-name-remove {
            color: #dc3545;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 3px;
        }

        .fv-mod-saved-name-remove:hover {
            background: #f8d7da;
        }

        .fv-mod-css-rules {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 3px;
            padding: 15px;
            margin-top: 15px;
            max-height: 300px;
            overflow-y: auto;
            font-size: 12px;
            line-height: 1.4;
        }

        .fv-mod-css-rules h4 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #333;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }

        .fv-mod-css-rules ul {
            margin: 5px 0;
            padding-left: 20px;
        }

        .fv-mod-css-rules li {
            margin-bottom: 5px;
        }

        .fv-mod-css-rules strong {
            color: #2c3e50;
        }

        .fv-mod-css-rules .quote {
            background: #f0f7ff;
            border-left: 3px solid #4a90e2;
            padding: 8px 10px;
            margin: 8px 0;
            font-style: italic;
        }

        .fv-mod-css-rules a {
            color: #3498db;
            text-decoration: none;
        }

        .fv-mod-css-rules a:hover {
            text-decoration: underline;
        }

        /* Improved dropdown styles */
        .fv-mod-categorized-select {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background: #fff;
            color: #333;
            font-family: sans-serif;
            font-size: 14px;
            box-sizing: border-box;
        }

        .fv-mod-categorized-select optgroup {
            font-weight: bold;
            font-size: 13px;
            color: #2c3e50;
            background: #f8f9fa;
            padding: 5px 0;
        }

        .fv-mod-categorized-select option {
            padding: 6px 10px;
            font-size: 13px;
        }

        .fv-mod-categorized-select option:checked {
            background: #4a90e2 linear-gradient(0deg, #4a90e2 0%, #4a90e2 100%);
            color: #fff;
        }

        .fv-mod-categorized-select option:hover {
            background: #f0f7ff;
        }

        .fv-mod-category-divider {
            font-weight: bold;
            color: #2c3e50;
            background: #f8f9fa;
            padding: 8px 10px;
            border-top: 1px solid #dee2e6;
        }

        .fv-mod-template-search {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background: #fff;
            color: #333;
            font-family: sans-serif;
            font-size: 14px;
            box-sizing: border-box;
        }

        .fv-mod-search-container {
            position: relative;
            margin-bottom: 10px;
        }

        .fv-mod-search-icon {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #666;
            pointer-events: none;
        }

        .fv-mod-search-container input {
            padding-right: 30px;
        }
    `);

    // CSS rules summary
    const cssRulesSummary = `
<strong>CSS Rules Summary:</strong><br><br>
<strong>Don't tamper with the site's navigation or game components.</strong><br>
Please do not use the CSS functions to: change the game information shown on your profile or villager's profile, overlay a fake image over your villager as if a Paintie were accepted with that image, hide or obscure game info or text or otherwise make the page unduly difficult to navigate.<br><br>

<strong>The following items must remain visible and cannot be hidden:</strong><br>
<ul>
<li><strong>All town shields</strong> (except small shield on own profile)</li>
<li><strong>Comments</strong> and their functionality</li>
<li><strong>Header and footer</strong> navigation</li>
<li><strong>Right-column widgets</strong> (user panel and active villager)</li>
<li><strong>Link buttons</strong> (transfer currency, menagerie, etc.)</li>
<li><strong>User information</strong> and gameplay elements</li>
<li><strong>Villager images and information</strong></li>
<li><strong>Paintie info boxes</strong> and functionality</li>
<li><strong>Trophies</strong> (can only be hidden via profile settings)</li>
</ul><br>

<strong>Prohibited animations:</strong>
<ul>
<li>No animated backgrounds (CSS or GIF)</li>
<li>No villager/paintie animations</li>
<li>CSS animations must be hover-triggered (except village shield)</li>
<li>Maximum rotation speed: 1 rotation per second</li>
<li>No creating moving objects</li>
</ul><br>

<strong>Note:</strong> Failure to follow these rules may result in your profile CSS being removed, modified, or disabled.
`;

    // Rule references with exact Furvilla rule text
    const ruleReferences = {
        "CSS violation": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Don't tamper with the site's navigation or game components. Please do not use the CSS functions to: change the game information shown on your profile or villager's profile, overlay a fake image over your villager as if a Paintie were accepted with that image, hide or obscure game info or text or otherwise make the page unduly difficult to navigate. The latter includes but is not limited to, upside down text, quickly spinning or bouncing images, backgrounds that are too similar to the text colour, and animated or high-contrast backgrounds.",
        "Generative AI usage": "As per [url=https://www.furvilla.com/news]site news:[/url] Furvilla does NOT allow any form of generative AI usage whatsoever. Furvilla prides itself in its creativity and handcrafted original artworks. We do not tolerate generative AI of any kind as we see this as a form of plagiarism and art theft. It's prohibited to use/post generative AI for Painties, Vistas, Art contest entries, Fur Idol entries, Art sales, Character sales, posting it and claiming it as your own created artwork, gift art for other users, character art in roleplays, character art in villager profile bios, profile CSS and descriptions, and any other place on the website that allows for artwork to be uploaded.",
        "Multi-account usage": "As per [url=https://www.furvilla.com/rules]site rules:[/url] You are only allowed to have one Furvilla account per person. Creating multiple accounts to gain advantages or circumvent restrictions is strictly prohibited.",
        "Account sharing": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Your account is for your personal use only. Do not share your account with anyone else, including friends or family members.",
        "Account trading/selling": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Buying, selling, or trading Furvilla accounts is strictly prohibited. Accounts are not transferable.",
        "Impersonating staff": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Impersonating Furvilla staff members is not allowed. This includes using similar usernames, pretending to have staff authority, or claiming to be a developer.",
        "Explicit/NSFW content": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not post pornographic, sexually explicit, or otherwise inappropriate content. Furvilla is a family-friendly site.",
        "Hate speech/discrimination": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not post content that attacks people based on their race, ethnicity, national origin, religion, sex, gender, sexual orientation, disability, or medical condition.",
        "Harassment/bullying": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not harass, bully, or threaten other users. This includes stalking, repeatedly messaging someone who has asked you to stop, or encouraging others to harass someone.",
        "Personal information sharing": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not share personal information about yourself or others. This includes real names, addresses, phone numbers, email addresses, or social media accounts.",
        "Illegal content": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not post pirated software or media. Software and media is covered under copyright law, which means you can't post any cracked software. You also can't post links to pirated movies, games, or other content, as this is illegal too.",
        "Real money trading": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not trade in-game items for real money. All trading must be done using in-game currency or items only.",
        "Account trading": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Accounts cannot be traded, sold, or given away. Your account is permanently linked to your email address.",
        "Prohibited item trading": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Some items are not tradable due to their nature or rarity. Attempting to trade these items is against the rules.",
        "Trade scamming": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not scam other players in trades. This includes lying about an item's value, changing the trade at the last second, or not delivering promised items.",
        "Spam posting": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not spam the forums or chat. This includes posting the same message repeatedly, posting irrelevant content, or bumping threads unnecessarily.",
        "Necroposting": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not post in threads that have been inactive for more than 3 months unless you have something relevant and important to add.",
        "Off-topic posting": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Keep discussions on-topic for the forum section you're posting in. Off-topic posts may be moved or deleted.",
        "Flame wars": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not engage in flame wars or personal attacks. Keep discussions civil and constructive.",
        "Bumping threads": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not bump threads without adding meaningful content. 'Bumping' just to bring a thread to the top of the forum is not allowed.",
        "Exploit usage": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not use exploits, bugs, or glitches to gain an unfair advantage. If you find a bug, report it to the staff.",
        "Cheating/hacking": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not use third-party programs to cheat or hack the game. This includes auto-clickers, bots, or any software that automates gameplay.",
        "Bug exploitation": "As per [url=https://www.furvilla.com/rules]site rules:[/url] If you discover a bug, report it to the staff immediately. Do not exploit it for personal gain.",
        "Auto-clickers/macros": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Using automated programs to play the game for you is not allowed. All gameplay should be done manually.",
        "Inappropriate usernames": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Usernames must be appropriate for all ages. Do not use offensive, sexual, or otherwise inappropriate names.",
        "Offensive villager names": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Villager names must be family-friendly. Do not use names that are offensive, sexual, or contain profanity.",
        "Impersonation names": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Do not use names that impersonate other players or staff members.",
        "Profanity in names": "As per [url=https://www.furvilla.com/rules]site rules:[/url] Names containing profanity, slurs, or offensive language are not allowed."
    };

    // Templates and categories
    const templateCategories = {
        "CSS Violations": {
            "CSS Violation - Hidden Navigation": {
                message: `Hello {username},

{rule_reference}

Your profile CSS has been found to hide essential site navigation elements. The following must remain visible at all times:
- Header and footer navigation (including search bar, logos, and links)
- Site navigation cannot be obscured or made difficult to use
- All links must remain functional and legible

Your CSS has been temporarily disabled. Please remove any code that hides or obscures site navigation and resubmit compliant CSS.

Thank you,
MOD-{modname}`,
                subject: "CSS Disabled - Hidden Navigation Violation"
            },
            "CSS Violation - Hidden Game Elements": {
                message: `Hello {username},

{rule_reference}

Your profile CSS has been found to hide essential game elements. The following must remain visible:
- Right-column widgets (user panel and active villager)
- Link buttons (transfer currency, menagerie, block, etc.)
- User information (ID, username, gender, etc.)
- Gameplay information cannot be hidden or obscured

These elements are essential for site functionality and gameplay. Your CSS has been modified to restore visibility.

Thank you,
MOD-{modname}`,
                subject: "CSS Modified - Hidden Game Elements"
            },
            "CSS Violation - Hidden Comments": {
                message: `Hello {username},

{rule_reference}

Your profile CSS has been found to hide comments or comment functionality. Please note:
- Comments, usernames, and avatars of comment posters must remain visible
- The report comment link cannot be hidden
- Comments can only be disabled in User Settings, not via CSS
- Individual comments can only be hidden using the "hide" button

Your CSS has been modified to restore comment visibility.

Thank you,
MOD-{modname}`,
                subject: "CSS Modified - Hidden Comments Violation"
            },
            "CSS Violation - Hidden Town Shields": {
                message: `Hello {username},

{rule_reference}

Your profile CSS has been found to hide town shields. Please note:
- All town shields must remain visible (both large and small shields)
- The large shield may be resized or the image changed, but text with the town name must still be visible
- The only exception is the small shield by your own username on your own profile page
- Town shields are essential for site navigation and community identification

Your CSS has been modified to restore shield visibility.

Thank you,
MOD-{modname}`,
                subject: "CSS Modified - Hidden Town Shields"
            },
            "CSS Violation - Hidden Villager Info": {
                message: `Hello {username},

{rule_reference}

Your profile CSS has been found to hide villager information. Please note:
- Villager images/painties cannot be hidden, resized, overlayed, or animated
- Villager information on villager profiles must remain visible
- Villager names and careers can only be removed from main user profile, not villager profiles
- Career link images on villager profiles must remain 100px by 100px
- Villager background banners can be hidden or changed, but not animated

Your CSS has been modified to restore villager information visibility.

Thank you,
MOD-{modname}`,
                subject: "CSS Modified - Hidden Villager Information"
            },
            "CSS Violation - Prohibited Animations": {
                message: `Hello {username},

{rule_reference}

Your profile CSS contains prohibited animations. Please note:
- No backgrounds can be animated (CSS animations or GIFs)
- Villager/Paintie images cannot be animated in any way
- CSS animations must be triggered by hover (except village shield)
- Animations must be subtle and not obtrusive
- Maximum rotation speed: 1 complete rotation per second
- No creating moving objects that travel around the page

Your CSS has been modified to remove these animations. Please review the CSS rules.

Thank you,
MOD-{modname}`,
                subject: "CSS Modified - Animation Violation"
            },
            "CSS Violation - General Warning": {
                message: `Hello {username},

{rule_reference}

Your profile CSS has been found to violate the site's CSS rules. Please review the CSS rules and ensure your custom CSS follows all guidelines. Common issues include:
- Hiding required elements (navigation, game info, comments, etc.)
- Using prohibited animations
- Making the page difficult to navigate
- Obscuring text or functionality

This is a warning. Please update your CSS within 24 hours or it will be removed/modified by staff.

Thank you,
MOD-{modname}`,
                subject: "Warning - CSS Rule Violation"
            }
        },
        "AI Violations": {
            "Generative AI Violation": {
                message: `Hello {username},

{rule_reference}

Your content has been found to contain generative AI artwork, which is strictly prohibited on Furvilla. As stated, we consider this a form of plagiarism and art theft.

This content has been removed and a warning has been issued. Please note that further violations will result in a permanent ban from Furvilla.

Thank you,
MOD-{modname}`,
                subject: "Violation - Generative AI Content"
            },
            "Generative AI Warning": {
                message: `Hello {username},

{rule_reference}

We have detected possible generative AI content in your uploads. Furvilla is a platform for handcrafted original artworks only. Please review our guidelines and ensure all content you upload is your own original work created without AI assistance.

This is a warning. Further violations will result in account suspension or permanent ban.

Thank you,
MOD-{modname}`,
                subject: "Warning - Generative AI Content Detected"
            },
            "Generative AI Permanent Ban": {
                message: `Hello {username},

{rule_reference}

Your account has been permanently banned for using generative AI content on Furvilla. As stated, we have a zero-tolerance policy for AI-generated content as we consider it a form of plagiarism and art theft.

If you believe this is an error, please contact art@furvilla.com to appeal.

Thank you,
MOD-{modname}`,
                subject: "Account Termination - Generative AI Violation"
            }
        },
        "Account Violations": {
            "Multi-account violation": {
                message: `Hello {username},

{rule_reference}

This account was found to be in violation of the site's rules: Owning more than one account. If you feel this is incorrect, please reach out to art@furvilla.com to appeal your ban.

Thank you,
MOD-{modname}`,
                subject: "Account Violation - Multi-Account Usage"
            },
            "Multi-account warning": {
                message: `Hello {username},

{rule_reference}

We have detected possible multi-account activity. Please remember that each player is only allowed one Furvilla account. Further violations may result in account suspension.

Thank you,
MOD-{modname}`,
                subject: "Warning - Multi-Account Activity Detected"
            },
            "Account Trading Violation": {
                message: `Hello {username},

{rule_reference}

Buying, selling, or trading Furvilla accounts is against our Terms of Service. This activity is not permitted.

Thank you,
MOD-{modname}`,
                subject: "Violation - Account Trading"
            }
        },
        "Content Violations": {
            "Inappropriate Content": {
                message: `Hello {username},

{rule_reference}

Please adhere to the community guidelines and avoid posting inappropriate content. A warning has been added to your account.

Thank you,
MOD-{modname}`,
                subject: "Warning - Inappropriate Content"
            },
            "Explicit Content Violation": {
                message: `Hello {username},

{rule_reference}

Your content contains explicit material that violates our Terms of Service. This content has been removed and a warning has been issued.

Thank you,
MOD-{modname}`,
                subject: "Violation - Explicit Content"
            },
            "NSFW Content Warning": {
                message: `Hello {username},

{rule_reference}

The content you posted is not safe for work and violates our community standards. Please review our content guidelines.

Thank you,
MOD-{modname}`,
                subject: "Warning - NSFW Content"
            },
            "Hate Speech Violation": {
                message: `Hello {username},

{rule_reference}

Your messages contain hate speech which violates our community guidelines. This behavior will not be tolerated.

Thank you,
MOD-{modname}`,
                subject: "Violation - Hate Speech"
            },
            "Harassment Template": {
                message: `Hello {username},

{rule_reference}

If you have problems with another Furvilla player, please contact a moderator to assist you. We're here to mediate any problems between players, but please bear in mind our Terms of Service forbids threads like this because they contain {reason}.

Thank you,
MOD-{modname}`,
                subject: "Harassment Warning"
            },
            "Bullying Warning": {
                message: `Hello {username},

{rule_reference}

Your behavior towards other players has been reported as bullying. Please treat all players with respect.

Thank you,
MOD-{modname}`,
                subject: "Warning - Bullying Behavior"
            },
            "Profile Violation": {
                message: `Hello {username},

{rule_reference}

Your profile contains content that violates our community guidelines. It has been cleared. Please review our Terms of Service regarding appropriate content.

Thank you,
MOD-{modname}`,
                subject: "Profile Content Violation"
            }
        },
        "Trading Violations": {
            "Illegal Trade Template": {
                message: `Hello {username},

{rule_reference}

This thread appears to be seeking a trade that's against the Terms of Service because {reason}. Please be sure to check the Terms to ensure your trade is permitted before reposting.

Thank you,
MOD-{modname}`,
                subject: "Trade Violation"
            },
            "Real Money Trading Violation": {
                message: `Hello {username},

{rule_reference}

Trading Furvilla items for real money is strictly prohibited. This activity has been stopped and a warning has been issued.

Thank you,
MOD-{modname}`,
                subject: "Violation - Real Money Trading"
            },
            "Prohibited Item Trading": {
                message: `Hello {username},

{rule_reference}

Some items are not tradable due to their nature or rarity. Attempting to trade these items is against the rules.

Thank you,
MOD-{modname}`,
                subject: "Violation - Prohibited Item Trading"
            },
            "Trade Scamming": {
                message: `Hello {username},

{rule_reference}

Do not scam other players in trades. This includes lying about an item's value, changing the trade at the last second, or not delivering promised items.

Thank you,
MOD-{modname}`,
                subject: "Warning - Trade Scamming"
            }
        },
        "Forum Violations": {
            "Spam Warning": {
                message: `Hello {username},

{rule_reference}

Your posts have been flagged as spam. Please refrain from posting repetitive or irrelevant content.

Thank you,
MOD-{modname}`,
                subject: "Warning - Spam Posting"
            },
            "Necroposting Warning": {
                message: `Hello {username},

{rule_reference}

Please avoid posting in threads that have been inactive for an extended period (necroposting). This disrupts forum organization.

Thank you,
MOD-{modname}`,
                subject: "Warning - Necroposting"
            },
            "Etiquette Reminder": {
                message: `Hello {username},

{rule_reference}

This thread doesn't appear to follow our Forum Etiquette because {reason}. Please be sure to read over the forum rules again.

Thank you,
MOD-{modname}`,
                subject: "Forum Etiquette Reminder"
            },
            "Off-topic posting": {
                message: `Hello {username},

{rule_reference}

Please keep discussions on-topic for the forum section you're posting in. Off-topic posts may be moved or deleted.

Thank you,
MOD-{modname}`,
                subject: "Warning - Off-topic Posting"
            },
            "Flame wars": {
                message: `Hello {username},

{rule_reference}

Please do not engage in flame wars or personal attacks. Keep discussions civil and constructive.

Thank you,
MOD-{modname}`,
                subject: "Warning - Flame War"
            },
            "Bumping threads": {
                message: `Hello {username},

{rule_reference}

Please do not bump threads without adding meaningful content. 'Bumping' just to bring a thread to the top of the forum is not allowed.

Thank you,
MOD-{modname}`,
                subject: "Warning - Thread Bumping"
            }
        },
        "Game Violations": {
            "Exploit Usage Warning": {
                message: `Hello {username},

{rule_reference}

We have detected possible exploit usage on your account. Using exploits to gain unfair advantages is strictly prohibited.

Thank you,
MOD-{modname}`,
                subject: "Warning - Exploit Usage"
            },
            "Cheating Violation": {
                message: `Hello {username},

{rule_reference}

Your account has been found using unauthorized methods to gain advantages. This violates our fair play policy.

Thank you,
MOD-{modname}`,
                subject: "Violation - Cheating"
            },
            "Bug exploitation": {
                message: `Hello {username},

{rule_reference}

If you discover a bug, report it to the staff immediately. Do not exploit it for personal gain.

Thank you,
MOD-{modname}`,
                subject: "Warning - Bug Exploitation"
            },
            "Auto-clickers/macros": {
                message: `Hello {username},

{rule_reference}

Using automated programs to play the game for you is not allowed. All gameplay should be done manually.

Thank you,
MOD-{modname}`,
                subject: "Warning - Automated Gameplay"
            }
        },
        "Naming Violations": {
            "Inappropriate Username": {
                message: `Hello {username},

{rule_reference}

Your username violates our naming guidelines. Please contact support@furvilla.com to request a username change.

Thank you,
MOD-{modname}`,
                subject: "Username Violation"
            },
            "Villager Name Violation": {
                message: `Hello {username},

{rule_reference}

Your villager name contains inappropriate content. It has been changed to a generic name. Please choose appropriate names for your villagers.

Thank you,
MOD-{modname}`,
                subject: "Villager Name Violation"
            },
            "Offensive villager names": {
                message: `Hello {username},

{rule_reference}

Villager names must be family-friendly. Do not use names that are offensive, sexual, or contain profanity.

Thank you,
MOD-{modname}`,
                subject: "Warning - Inappropriate Villager Name"
            },
            "Impersonation names": {
                message: `Hello {username},

{rule_reference}

Do not use names that impersonate other players or staff members.

Thank you,
MOD-{modname}`,
                subject: "Warning - Impersonation Name"
            },
            "Profanity in names": {
                message: `Hello {username},

{rule_reference}

Names containing profanity, slurs, or offensive language are not allowed.

Thank you,
MOD-{modname}`,
                subject: "Warning - Profane Name"
            }
        },
        "Warnings & Bans": {
            "First Warning": {
                message: `Hello {username},

You have received a warning for violating Furvilla's Terms of Service. Please review the rules at [url=https://www.furvilla.com/rules]https://www.furvilla.com/rules[/url] to ensure you understand our community guidelines.

{rule_reference}

This is your first warning. Further violations may result in temporary or permanent bans.

Thank you,
MOD-{modname}`,
                subject: "First Warning - Terms of Service Violation"
            },
            "Final Warning": {
                message: `Hello {username},

You have received a final warning for violating Furvilla's Terms of Service. Please review the rules at [url=https://www.furvilla.com/rules]https://www.furvilla.com/rules[/url] to ensure you understand our community guidelines.

{rule_reference}

This is your final warning. Any further violations of our Terms of Service will result in a permanent ban from Furvilla.

Thank you,
MOD-{modname}`,
                subject: "Final Warning - Terms of Service Violation"
            },
            "Minor Ban (3 days)": {
                message: `Hello {username},

{rule_reference}

Your account has been temporarily banned for 3 days due to repeated violations of our Terms of Service. Please use this time to review the rules at [url=https://www.furvilla.com/rules]https://www.furvilla.com/rules[/url].

Thank you,
MOD-{modname}`,
                subject: "Account Suspension - 3 Days"
            },
            "Medium Ban (7 days)": {
                message: `Hello {username},

{rule_reference}

Your account has been temporarily banned for 7 days due to continued violations of our Terms of Service. Please use this time to review the rules at [url=https://www.furvilla.com/rules]https://www.furvilla.com/rules[/url].

Thank you,
MOD-{modname}`,
                subject: "Account Suspension - 7 Days"
            },
            "Major Ban (30 days)": {
                message: `Hello {username},

{rule_reference}

Your account has been temporarily banned for 30 days due to persistent violations of our Terms of Service. Please use this time to review the rules at [url=https://www.furvilla.com/rules]https://www.furvilla.com/rules[/url].

Thank you,
MOD-{modname}`,
                subject: "Account Suspension - 30 Days"
            },
            "Permanent Ban": {
                message: `Hello {username},

{rule_reference}

Your account has been permanently banned for severe violations of Furvilla's Terms of Service. If you believe this is an error, please contact art@furvilla.com to appeal.

Thank you,
MOD-{modname}`,
                subject: "Account Termination - Permanent Ban"
            }
        },
        "Other Templates": {
            "Suggestion Template": {
                message: `Hello {username},

Thank you for the suggestions on this thread. We encourage players to contact us by e-mail with their suggestions so we can file them in e-mail folders and/or forward them to the appropriate staff members. If you would be so kind as to send your feedback to support@furvilla.com, we'd really appreciate it!

Thank you,
MOD-{modname}`,
                subject: "Suggestion Submission"
            },
            "Personal information sharing": {
                message: `Hello {username},

{rule_reference}

Do not share personal information about yourself or others. This includes real names, addresses, phone numbers, email addresses, or social media accounts.

Thank you,
MOD-{modname}`,
                subject: "Warning - Personal Information Sharing"
            },
            "Illegal content": {
                message: `Hello {username},

{rule_reference}

Do not post pirated software or media. Software and media is covered under copyright law, which means you can't post any cracked software. You also can't post links to pirated movies, games, or other content, as this is illegal too.

Thank you,
MOD-{modname}`,
                subject: "Warning - Illegal Content"
            }
        }
    };

    // templates
    const allTemplates = {};
    Object.values(templateCategories).forEach(category => {
        Object.assign(allTemplates, category);
    });

    // Rules categories
    const ruleCategories = {
        "CSS Rules": [
            "CSS violation"
        ],
        "AI Rules": [
            "Generative AI usage"
        ],
        "Account Rules": [
            "Multi-account usage",
            "Account sharing",
            "Account trading/selling",
            "Impersonating staff"
        ],
        "Content Rules": [
            "Explicit/NSFW content",
            "Hate speech/discrimination",
            "Harassment/bullying",
            "Personal information sharing",
            "Illegal content"
        ],
        "Trading Rules": [
            "Real money trading",
            "Account trading",
            "Prohibited item trading",
            "Trade scamming"
        ],
        "Forum Rules": [
            "Spam posting",
            "Necroposting",
            "Off-topic posting",
            "Flame wars",
            "Bumping threads"
        ],
        "Game Rules": [
            "Exploit usage",
            "Cheating/hacking",
            "Bug exploitation",
            "Auto-clickers/macros"
        ],
        "Naming Rules": [
            "Inappropriate usernames",
            "Offensive villager names",
            "Impersonation names",
            "Profanity in names"
        ]
    };

    // Storage
    function getSavedModNames() {
        try {
            const saved = localStorage.getItem('fv_mod_names');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error loading saved MOD names:', e);
            return [];
        }
    }

    function saveModName(name) {
        if (!name || name.trim() === '') return;

        const savedNames = getSavedModNames();
        const trimmedName = name.trim();

        const index = savedNames.indexOf(trimmedName);
        if (index > -1) {
            savedNames.splice(index, 1);
        }

        // Add to beginning of array (most recent first)
        savedNames.unshift(trimmedName);

        const limitedNames = savedNames.slice(0, 10);

        try {
            localStorage.setItem('fv_mod_names', JSON.stringify(limitedNames));
            return limitedNames;
        } catch (e) {
            console.error('Error saving MOD name:', e);
            return savedNames;
        }
    }

    function removeSavedModName(name) {
        const savedNames = getSavedModNames();
        const index = savedNames.indexOf(name);

        if (index > -1) {
            savedNames.splice(index, 1);
            try {
                localStorage.setItem('fv_mod_names', JSON.stringify(savedNames));
            } catch (e) {
                console.error('Error removing MOD name:', e);
            }
        }

        return savedNames;
    }

    // Copy to clipboard
    function copyToClipboard(text) {
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(text);
            return true;
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
        } else {
            return fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        } catch (e) {
            console.error('Fallback copy failed:', e);
            return false;
        }
    }

    function extractUsername() {
        const selectors = ['.username', '.user-name', '.profile-username', 'h1', '.profile-header strong', 'a[href*="profile"] strong', '.post-author'];
        for (const selector of selectors) {
            const elem = document.querySelector(selector);
            if (elem) {
                const text = (elem.textContent || elem.innerText).trim();
                if (text && text.length > 1 && !text.includes('@') && !text.includes('http') && text.length < 30) {
                    return text;
                }
            }
        }
        return null;
    }

    function showStatus(button, message) {
        const statusDiv = button.parentElement.querySelector('.fv-mod-status');
        if (statusDiv) {
            statusDiv.textContent = message;
            setTimeout(() => { statusDiv.textContent = ''; }, 2000);
        }
    }

    function autoFillForm(username, subject, message) {
        const recipientIdInput = document.querySelector('input[name="recipient_id"]');
        if (recipientIdInput && username) {
            if (/^\d+$/.test(username)) {
                recipientIdInput.value = username;
            }
        }

        const subjectInput = document.querySelector('input[name="name"]');
        if (subjectInput && subject) {
            subjectInput.value = subject;
        }

        // Fill message text field
        const messageTextarea = document.querySelector('textarea[name="text"]');
        if (messageTextarea && message) {
            messageTextarea.value = message;
            const event = new Event('input', { bubbles: true });
            messageTextarea.dispatchEvent(event);
        }

        return true;
    }

    function createTemplatesUI() {
        const container = document.createElement('div');
        container.className = 'fv-mod-panel';

        const header = document.createElement('div');
        header.className = 'fv-mod-header';
        header.textContent = 'Moderation Templates';
        container.appendChild(header);

        const section = document.createElement('div');
        section.className = 'fv-mod-section';

        // MOD name input with saved names
        const modLabel = document.createElement('div');
        modLabel.className = 'fv-mod-label';
        modLabel.textContent = 'Your MOD Name';
        section.appendChild(modLabel);

        const modInput = document.createElement('input');
        modInput.type = 'text';
        modInput.className = 'fv-mod-input';
        modInput.placeholder = 'Enter your moderator name';
        modInput.id = 'fv-mod-name';

        // Load last used MOD name
        const savedNames = getSavedModNames();
        if (savedNames.length > 0) {
            modInput.value = savedNames[0];
        }

        section.appendChild(modInput);

        // Save MOD name button
        const saveModBtn = document.createElement('button');
        saveModBtn.className = 'fv-mod-btn quaternary';
        saveModBtn.textContent = 'Save MOD Name';
        saveModBtn.id = 'fv-save-mod-btn';
        section.appendChild(saveModBtn);

        // Saved names list
        const savedNamesContainer = document.createElement('div');
        savedNamesContainer.className = 'fv-mod-saved-names';
        savedNamesContainer.id = 'fv-saved-names';
        section.appendChild(savedNamesContainer);

        // update saved names list
        function updateSavedNamesList() {
            const savedNames = getSavedModNames();
            savedNamesContainer.innerHTML = '';

            if (savedNames.length === 0) {
                savedNamesContainer.style.display = 'none';
                return;
            }

            savedNamesContainer.style.display = 'block';

            savedNames.forEach(name => {
                const item = document.createElement('div');
                item.className = 'fv-mod-saved-name-item';

                const textSpan = document.createElement('span');
                textSpan.className = 'fv-mod-saved-name-text';
                textSpan.textContent = name;
                textSpan.addEventListener('click', () => {
                    modInput.value = name;
                });

                const removeBtn = document.createElement('button');
                removeBtn.className = 'fv-mod-saved-name-remove';
                removeBtn.textContent = '×';
                removeBtn.title = 'Remove this name';
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeSavedModName(name);
                    updateSavedNamesList();
                });

                item.appendChild(textSpan);
                item.appendChild(removeBtn);
                savedNamesContainer.appendChild(item);
            });
        }

        // User input
        const userLabel = document.createElement('div');
        userLabel.className = 'fv-mod-label';
        userLabel.textContent = 'Username/ID';
        section.appendChild(userLabel);

        const userInput = document.createElement('input');
        userInput.type = 'text';
        userInput.className = 'fv-mod-input';
        userInput.placeholder = 'Enter username or user ID';
        userInput.id = 'fv-username';
        section.appendChild(userInput);

        // Collapse rule violations section
        const rulesCollapsible = document.createElement('div');
        rulesCollapsible.className = 'fv-mod-collapsible';
        rulesCollapsible.textContent = '▼ Select Rule Violations';
        section.appendChild(rulesCollapsible);

        const rulesContent = document.createElement('div');
        rulesContent.className = 'fv-mod-collapsible-content';
        rulesContent.id = 'fv-rules-content';

        const rulesContainer = document.createElement('div');
        rulesContainer.className = 'fv-mod-checkbox-group';
        rulesContainer.id = 'fv-rules-container';

        Object.keys(ruleCategories).forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'fv-mod-rule-section';

            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'fv-mod-title';
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);

            ruleCategories[category].forEach(rule => {
                const ruleId = rule.toLowerCase().replace(/[^a-z0-9]/g, '_');

                const ruleDiv = document.createElement('div');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'fv-mod-checkbox';
                checkbox.id = `rule_${ruleId}`;
                checkbox.value = rule;
                checkbox.dataset.ruleReference = ruleReferences[rule] || '';

                const label = document.createElement('label');
                label.className = 'fv-mod-rule-label';
                label.htmlFor = `rule_${ruleId}`;
                label.textContent = rule;
                label.title = "Click to view rule reference";

                ruleDiv.appendChild(checkbox);
                ruleDiv.appendChild(label);
                categoryDiv.appendChild(ruleDiv);
            });

            rulesContainer.appendChild(categoryDiv);
        });

        rulesContent.appendChild(rulesContainer);
        section.appendChild(rulesContent);

        // Toggle collapse
        rulesCollapsible.addEventListener('click', function() {
            this.classList.toggle('active');
            rulesContent.classList.toggle('expanded');
            this.textContent = rulesContent.classList.contains('expanded') ? '▲ Select Rule Violations' : '▼ Select Rule Violations';
        });

        // Rule ref
        const ruleRefDiv = document.createElement('div');
        ruleRefDiv.className = 'fv-mod-rule-reference';
        ruleRefDiv.id = 'fv-rule-reference';
        ruleRefDiv.innerHTML = '<div class="fv-mod-rule-ref-title">Selected Rule Reference:</div><div id="fv-rule-ref-text"></div>';
        section.appendChild(ruleRefDiv);

        // Custom reason text area
        const customReasonLabel = document.createElement('div');
        customReasonLabel.className = 'fv-mod-label';
        customReasonLabel.textContent = 'Custom Reason (optional)';
        customReasonLabel.style.marginTop = '10px';
        section.appendChild(customReasonLabel);

        const customReasonTextarea = document.createElement('textarea');
        customReasonTextarea.className = 'fv-mod-textarea';
        customReasonTextarea.placeholder = 'Add additional details or combine reasons here...';
        customReasonTextarea.id = 'fv-custom-reason';
        section.appendChild(customReasonTextarea);

        // Combined reason display
        const combinedReasonDiv = document.createElement('div');
        combinedReasonDiv.className = 'fv-mod-combined-reason';
        combinedReasonDiv.id = 'fv-combined-reason';
        combinedReasonDiv.style.display = 'none';
        combinedReasonDiv.innerHTML = '<strong>Combined Reason:</strong><br><span id="fv-reason-text"></span>';
        section.appendChild(combinedReasonDiv);

        // Update combined reason button
        const updateReasonBtn = document.createElement('button');
        updateReasonBtn.className = 'fv-mod-btn secondary';
        updateReasonBtn.textContent = 'Update Combined Reason';
        updateReasonBtn.id = 'fv-update-reason';
        section.appendChild(updateReasonBtn);

        // template search
        const searchContainer = document.createElement('div');
        searchContainer.className = 'fv-mod-search-container';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'fv-mod-template-search';
        searchInput.placeholder = 'Search templates...';
        searchInput.id = 'fv-template-search';

        const searchIcon = document.createElement('div');
        searchIcon.className = 'fv-mod-search-icon';
        searchIcon.innerHTML = '🔍';

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchIcon);
        section.appendChild(searchContainer);

        // selection with categories
        const templateLabel = document.createElement('div');
        templateLabel.className = 'fv-mod-label';
        templateLabel.textContent = 'Select Template';
        templateLabel.style.marginTop = '15px';
        section.appendChild(templateLabel);

        const select = document.createElement('select');
        select.className = 'fv-mod-categorized-select';
        select.id = 'fv-template-select';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Choose a template...';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        // categories
        Object.keys(templateCategories).forEach(category => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = `━━━━━━ ${category}`;

            Object.keys(templateCategories[category]).forEach(templateName => {
                const option = document.createElement('option');
                option.value = templateName;
                option.textContent = templateName;
                option.dataset.category = category;
                optgroup.appendChild(option);
            });

            select.appendChild(optgroup);
        });

        section.appendChild(select);

        // preview
        const previewLabel = document.createElement('div');
        previewLabel.className = 'fv-mod-label';
        previewLabel.textContent = 'Preview';
        previewLabel.style.marginTop = '10px';
        section.appendChild(previewLabel);

        const preview = document.createElement('div');
        preview.className = 'fv-mod-preview';
        preview.id = 'fv-template-preview';
        preview.textContent = 'Select a template to preview it here';
        section.appendChild(preview);

        // Button group for Copy and Autofill
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'fv-mod-btn-group';

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'fv-mod-btn';
        copyBtn.textContent = 'Copy to Clipboard';
        copyBtn.id = 'fv-copy-btn';
        buttonGroup.appendChild(copyBtn);

        // Autofill button
        const autoFillBtn = document.createElement('button');
        autoFillBtn.className = 'fv-mod-btn tertiary';
        autoFillBtn.textContent = 'Auto-fill Form';
        autoFillBtn.id = 'fv-autofill-btn';
        buttonGroup.appendChild(autoFillBtn);

        section.appendChild(buttonGroup);

        const status = document.createElement('div');
        status.className = 'fv-mod-status';
        section.appendChild(status);

        // CSS Rules Guide
        const cssRulesCollapsible = document.createElement('div');
        cssRulesCollapsible.className = 'fv-mod-collapsible';
        cssRulesCollapsible.textContent = '▼ CSS Rules Summary';
        section.appendChild(cssRulesCollapsible);

        const cssRulesContent = document.createElement('div');
        cssRulesContent.className = 'fv-mod-collapsible-content';
        cssRulesContent.id = 'fv-css-rules-content';

        const cssRulesDiv = document.createElement('div');
        cssRulesDiv.className = 'fv-mod-css-rules';
        cssRulesDiv.innerHTML = cssRulesSummary;
        cssRulesContent.appendChild(cssRulesDiv);
        section.appendChild(cssRulesContent);

        // Toggle CSS rules
        cssRulesCollapsible.addEventListener('click', function() {
            this.classList.toggle('active');
            cssRulesContent.classList.toggle('expanded');
            this.textContent = cssRulesContent.classList.contains('expanded') ? '▲ CSS Rules Summary' : '▼ CSS Rules Summary';
        });

        container.appendChild(section);

        const leftColumn = document.querySelector('.left-column');
        if (leftColumn) {
            const form = leftColumn.querySelector('form');
            if (form) {
                leftColumn.insertBefore(container, form.nextSibling);
            } else {
                leftColumn.appendChild(container);
            }
        } else {
            document.body.appendChild(container);
        }

        const detectedUsername = extractUsername();
        if (detectedUsername) {
            userInput.value = detectedUsername;
        }

        // Initialize saved names list
        updateSavedNamesList();

        // Update rule reference display
        function updateRuleReferenceDisplay() {
            const checkboxes = rulesContainer.querySelectorAll('input[type="checkbox"]:checked');
            const ruleRefText = document.getElementById('fv-rule-ref-text');
            const ruleRefDiv = document.getElementById('fv-rule-reference');

            if (checkboxes.length > 0) {
                const firstRule = checkboxes[0].value;
                const reference = ruleReferences[firstRule] || '';
                ruleRefText.textContent = reference;
                ruleRefDiv.style.display = 'block';

                if (checkboxes.length > 1) {
                    ruleRefText.textContent += '\n\nAdditional rules also apply.';
                }
            } else {
                ruleRefDiv.style.display = 'none';
            }
        }

        // update combined reason
        function updateCombinedReason() {
            const checkboxes = rulesContainer.querySelectorAll('input[type="checkbox"]:checked');
            const customReason = customReasonTextarea.value.trim();

            let reasons = [];
            checkboxes.forEach(cb => {
                reasons.push(cb.value);
            });

            let combinedText = '';
            if (reasons.length > 0) {
                if (reasons.length === 1) {
                    combinedText = reasons[0];
                } else if (reasons.length === 2) {
                    combinedText = `${reasons[0]} and ${reasons[1]}`;
                } else {
                    combinedText = reasons.slice(0, -1).join(', ') + ', and ' + reasons[reasons.length - 1];
                }

                if (customReason) {
                    combinedText += `. ${customReason}`;
                }
            } else if (customReason) {
                combinedText = customReason;
            }

            const reasonText = document.getElementById('fv-reason-text');
            if (reasonText) {
                reasonText.textContent = combinedText || 'No reasons selected';
                combinedReasonDiv.style.display = combinedText ? 'block' : 'none';
            }

            return combinedText;
        }

        // primary rule reference
        function getPrimaryRuleReference() {
            const checkboxes = rulesContainer.querySelectorAll('input[type="checkbox"]:checked');
            if (checkboxes.length > 0) {
                const firstRule = checkboxes[0].value;
                return ruleReferences[firstRule] || '';
            }
            return '';
        }

        // complete message
        function generateMessage() {
            const selected = select.value;
            if (!selected || !allTemplates[selected]) {
                return null;
            }

            const template = allTemplates[selected];
            let message = template.message;
            const modName = modInput.value.trim();
            const username = userInput.value.trim();

            // combined reason
            const combinedReason = updateCombinedReason();

            // primary rule reference
            const primaryRuleRef = getPrimaryRuleReference();

            message = message.replace(/{username}/g, username || 'User');
            message = message.replace(/{modname}/g, modName || 'Moderator');
            message = message.replace(/{reason}/g, combinedReason || 'it violates our community guidelines');
            message = message.replace(/{rule_reference}/g, primaryRuleRef || 'As per [url=https://www.furvilla.com/rules]site rules:[/url] Please review our community guidelines.');

            return {
                message: message,
                subject: template.subject,
                username: username
            };
        }

        // Funct filter templates based on search EARLY VER
        function filterTemplates(searchTerm) {
            searchTerm = searchTerm.toLowerCase().trim();
            const options = select.querySelectorAll('option');
            const optgroups = select.querySelectorAll('optgroup');

            if (!searchTerm) {
                options.forEach(option => {
                    option.style.display = '';
                });
                optgroups.forEach(optgroup => {
                    optgroup.style.display = '';
                });
                return;
            }

            options.forEach(option => {
                option.style.display = 'none';
            });
            optgroups.forEach(optgroup => {
                optgroup.style.display = 'none';
            });

            options.forEach(option => {
                if (option.value && option.textContent.toLowerCase().includes(searchTerm)) {
                    option.style.display = '';
                    const parentOptgroup = option.parentElement;
                    parentOptgroup.style.display = '';
                }
            });

            const defaultOption = select.querySelector('option[value=""]');
            if (defaultOption) {
                defaultOption.style.display = '';
            }
        }

        saveModBtn.addEventListener('click', () => {
            const modName = modInput.value.trim();
            if (modName) {
                saveModName(modName);
                updateSavedNamesList();
                showStatus(saveModBtn, '✓ MOD name saved!');
            } else {
                showStatus(saveModBtn, '❌ Please enter a MOD name');
            }
        });

        updateReasonBtn.addEventListener('click', () => {
            updateCombinedReason();
            updateRuleReferenceDisplay();
        });

        rulesContainer.addEventListener('change', () => {
            updateCombinedReason();
            updateRuleReferenceDisplay();
        });

        customReasonTextarea.addEventListener('input', () => {
            updateCombinedReason();
        });

        select.addEventListener('change', () => {
            const selected = select.value;
            if (selected && allTemplates[selected]) {
                preview.textContent = allTemplates[selected].message || 'Select a template to preview it here';
            } else {
                preview.textContent = 'Select a template to preview it here';
            }
        });

        // Search func EARLY VER
        searchInput.addEventListener('input', () => {
            filterTemplates(searchInput.value);
        });

        select.addEventListener('click', () => {
            searchInput.value = '';
            filterTemplates('');
        });

        copyBtn.addEventListener('click', () => {
            const generated = generateMessage();
            if (generated) {
                if (copyToClipboard(generated.message)) {
                    showStatus(copyBtn, '✓ Template copied to clipboard!');
                } else {
                    showStatus(copyBtn, '❌ Failed to copy');
                }
            } else {
                showStatus(copyBtn, '❌ Please select a template first');
            }
        });

        autoFillBtn.addEventListener('click', () => {
            const generated = generateMessage();
            if (generated) {
                if (autoFillForm(generated.username, generated.subject, generated.message)) {
                    showStatus(autoFillBtn, '✓ Form auto-filled!');

                    const form = document.querySelector('form');
                    if (form) {
                        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    showStatus(autoFillBtn, '❌ Failed to auto-fill form');
                }
            } else {
                showStatus(autoFillBtn, '❌ Please select a template first');
            }
        });

        return container;
    }

    function init() {
        setTimeout(() => {
            const leftColumn = document.querySelector('.left-column');
            if (leftColumn) {
                createTemplatesUI();
            }
        }, 1000);
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();