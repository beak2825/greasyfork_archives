// ==UserScript==
// @name         Meeland Script
// @namespace    meeland-script
// @version      3.65
// @description  Meeland.io cheat script with auto-lock, speed boost, infinite jump, teleportation & more! Works on CrazyGames, twoplayergames.org, meeland.io, iogames.onl, sprunki-game.io, gameflare.com and other sites hosting Meeland
// @match        *://*/*
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561477/Meeland%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/561477/Meeland%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Early bailout: Only proceed if this is actually Meeland (PlayCanvas game with expected entities)
    if (!window.pc?.app?.root) {
        return;
    }

    // Wait a bit to ensure game entities are loaded, then verify this is Meeland
    setTimeout(() => {
        const isMeeland = window.pc?.app?.root?.findByName?.('Player') || 
                         window.pc?.app?.root?.findByName?.('Camera') ||
                         window.pc?.app?.root?.children?.[0]?.findByName?.('NetworkManager');
        
        if (!isMeeland) {
            return;
        }
    }, 500);

    // ==== CONFIGURATION ====
    const PAD_DISTANCE_BEHIND = 10;
    const READINESS_CHECK_INTERVAL = 100;
    const READINESS_MAX_WAIT = 10000;
    const SPEED_BOOST_MULTIPLIER = 4;
    const TELEPORT_DISTANCE = 8.75;
    const POSITION_STABLE_THRESHOLD = 0.1; // Position change less than this = stable (0.1 allows micro-drift)
    const POSITION_STABLE_DURATION = 250; // Wait for position to be stable for this long (ms)
    const PET_THEFT_COOLDOWN_MS = 15000; // Cooldown between pet theft taunts
    // =======================

    // ==== GREASYFORK PROMO VARIATIONS ====
    const GREASYFORK_PROMOS = [
        "Try the Meeland Script on Greasyfork.org",
        "Get the Meeland Script from Greasyfork.org",
        "Download Meeland Script at Greasyfork.org",
        "Meeland Script available on Greasyfork.org",
        "Find the Meeland Script on Greasyfork.org",
        "Meeland Script - Greasyfork.org",
        "Check out Meeland Script on Greasyfork.org",
        "Get enhanced Meeland gameplay at Greasyfork.org",
        "Meeland Script @ Greasyfork.org - Try it!",
        "Level up your Meeland game: Greasyfork.org"
    ];
    // =======================

    // ==== TRADE PHRASES (paste your phrases here, one per line in quotes) ====
const TRADE_PHRASES = [
    "A little fire, Scarecrow?",
    "Acting is an art which consists of keeping the audience from coughing.",
    "Anchovies? You've got the wrong man! I spell my name DANGER! (click)",
    "Benson, you are so free of the ravages of intelligence.",
    "But I don't like Spam!",
    "Calvin Coolidge looks as if he had been weaned on a pickle.",
    "Deliver yesterday, code today, think tomorrow.",
    "Do not stop to ask what is it; Let us go and make our visit.",
    "Do you have blacks, too?",
    "Don't let your mouth write no check that your tail can't cash.",
    "Don't say yes until I finish talking.",
    "Drawing on my fine command of language, I said nothing.",
    "Earth is a great, big funhouse without the fun.",
    "Even the best of friends cannot attend each other's funeral.",
    "Every time I think I know where it's at, they move it.",
    "Grub first, then ethics.",
    "He was so narrow minded he could see through a keyhole with both eyes...",
    "He's the kind of man for the times that need the kind of man he is ...",
    "\"His mind is like a steel trap",
    "I am not an Economist. I am an honest man!",
    "I am not sure what this is, but an `F' would only dignify it.",
    "I don't care who does the electing as long as I get to do the nominating.",
    "I don't have any solution but I certainly admire the problem.",
    "I just need enough to tide me over until I need more.",
    "I may not be totally perfect, but parts of me are excellent.",
    "I was under medication when I made the decision not to burn the tapes.",
    "I'd give my right arm to be ambidextrous.",
    "If dolphins are so smart, why did Flipper work for television?",
    "If the King's English was good enough for Jesus, it's good enough for me!",
    "If you can count your money, you don't have a billion dollars.",
    "In defeat, unbeatable; in victory, unbearable.",
    "It's bad luck to be superstitious.",
    "It's not Camelot, but it's not Cleveland, either.",
    "Laughter is the closest distance between two people.",
    "Man invented language to satisfy his deep need to complain.",
    "Mate, this parrot wouldn't VOOM if you put four million volts through it!",
    "Nondeterminism means never having to say you are wrong.",
    "One planet is all you get.",
    "She is descended from a long line that her mother listened to.",
    "Stealing a rhinoceros should not be attempted lightly.",
    "That must be wonderful! I don't understand it at all.",
    "The bland leadeth the bland and they both shall fall into the kitsch.",
    "The illegal we do immediately. The unconstitutional takes a bit longer.",
    "The sooner you fall behind, the more time you'll have to catch up!",
    "The streets are safe in Philadelphia. It's only the people who make them unsafe.",
    "There was a boy called Eustace Clarence Scrubb, and he almost deserved it.",
    "They gave me a book of checks. They didn't ask for any deposits.",
    "To YOU I'm an atheist; to God, I'm the Loyal Opposition.",
    "To vacillate or not to vacillate, that is the question ... or is it?",
    "Tom Hayden is the kind of politician who gives opportunism a bad name.",
    "Under capitalism, man exploits man. Under Communism, it's just the opposite.",
    "We don't care. We don't have to. We're the Phone Company.",
    "\"We don't have to protect the environment",
    "We'll cross out that bridge when we come back to it later.",
    "Well, if you can't believe what you read in a comic book, what CAN you believe?!",
    "What is the robbing of a bank compared to the FOUNDING of a bank?",
    "When the going gets tough, the tough get empirical.",
    "Why be a man, when you can be a success?",
    "Why isn't there a special name for the tops of your feet?",
    "Why was I born with such contemporaries?",
    "You can't teach people to be lazy - either they have it, or they don't.",
    "You'll never be the man your mother was!",
    "$100 invested at 7",
    "'Martyrdom' is the only way a person can become famous without ability.",
    "'Tis not too late to seek a newer world.",
    "[Humanity] is the measure of all things.",
    "... And malt does more than Milton can/To justify God's ways to man",
    "Any resemblance between the above and my own views is non-deterministic.",
    "... at least I thought I was dancing, 'til somebody stepped on my hand.",
    "... they [the Indians] are not running but are coming on.",
    "...though his invention worked superbly",
    "full ... please delete anyone you can.",
    "10.0 times 0.1 is hardly ever 1.0.",
    "43rd Law of Computing: Anything that can go wr fortune: Segmentation fault",
    "80 percent of all statistics are made up on the spot, including this one.",
    "of all guys are within one standard deviation of your mom.",
    "A LISP programmer knows the value of everything, but the cost of nothing.",
    "A bore is a man you deprives you of solitude without providing you with company.",
    "A Nixon [is preferable to] a Dean Rusk",
    "A Puritan is someone who is deathly afraid that someone somewhere is having fun.",
    "A billion here, a billion there, sooner or later it adds up to real money.",
    "A celebrity is a person who is known for his well-knownness.",
    "A child's education should begin at least 100 years before he is born.",
    "A city is a large community where people are lonesome together.",
    "A clash of doctrine is not a disaster",
    "A closed mouth gathers no foot.",
    "A conclusion is simply the place where someone got tired of thinking.",
    "A conservative is one who is too cowardly to fight and too fat to run.",
    "A countryman between two lawyers is like a fish between two cats.",
    "A critic is a legless man who teaches running.",
    "A day without sunshine is like night.",
    "A decision occurs when one abandons the obvious for the possible.",
    "A diplomat is a man who can convince his wife she'd look stout in a fur coat.",
    "A diplomat is a man who always remembers a woman's birthday but never her age.",
    "A diva who specializes in risque arias is an off-coloratura soprano ...",
    "A door is what a dog is perpetually on the wrong side of.",
    "A fanatic is a person who can't change his mind and won't change the subject.",
    "A fool must now and then be right by chance.",
    "A foolish consistency is the hobgoblin of little minds.",
    "A formal parsing algorithm should not always be used.",
    "A good memory does not equal pale ink.",
    "A good workman is known by his tools.",
    "A handful of friends is worth more than a wagon of gold.",
    "A hermit is a deserter from the army of humanity.",
    "A journey of a thousand miles begins with a cash advance.",
    "A king's castle is his home.",
    "A lack of leadership is no substitute for inaction.",
    "A little caution outflanks a large cavalry.",
    "A man forgives only when he is in the wrong.",
    "A man is not old until regrets take the place of dreams.",
    "A man paints with his brains and not with his hands.",
    "A man shall never be enriched by envy.",
    "A man who fishes for marlin in ponds will put his money in Etruscan bonds.",
    "A man who turns green has eschewed protein.",
    "A man wrapped up in himself makes a very small package.",
    "A mathematician is a machine for converting coffee into theorems.",
    "A moose once bit my sister.",
    "A morsel of genuine history is a thing so rare as to be always valuable.",
    "A nuclear war can ruin your whole day.",
    "A penny saved is ridiculous.",
    "A person is just about as big as the things that make them angry.",
    "A person who knows only one side of a question knows little of that.",
    "A physicist is an atom's way of knowing about atoms.",
    "A plucked goose doesn't lay golden eggs.",
    "A professor is one who talks in someone else's sleep.",
    "A right is not what someone gives you; it's what no one can take from you.",
    "A second marriage is the triumph of hope over experience.",
    "A sine curve goes off into infinity or at least to the end of the blackboard.",
    "A smile is the shortest distance between two people.",
    "A straw vote only shows which way the hot air blows.",
    "A student who changes the course of history is probably taking an exam.",
    "A truly wise man never plays leapfrog with a unicorn.",
    "A visit to a fresh place will bring strange work.",
    "A visit to a strange place will bring fresh work.",
    "A well-known friend is a treasure.",
    "A witty saying proves nothing.",
    "A woman without a man is like a fish without a bicycle.",
    "A year spent in artificial intelligence is enough to make one believe in God.",
    "Abandon hope, all ye who press \"ENTER\" here.",
    "Ability is useless unless it is used.",
    "About all some men accomplish in life is to send a son to Harvard.",
    "About the only thing on a farm that has an easy time is the dog.",
    "About the time we think we can make ends meet, somebody moves the ends.",
    "Above all things, reverence yourself.",
    "Abstention makes the heart grow fonder.",
    "According to my best recollection, I don't remember.",
    "According to the latest official figures, 43",
    "of all statistics are totally worthless.",
    "Accordion: A bagpipe with pleats.",
    "Accuracy: The vice of being right.",
    "Acting is an art which consists of keeping the audience from coughing.",
    "Activity makes more men's fortunes than cautiousness.",
    "Actors will happen in the best-regulated families.",
    "Ada is the work of an architect, not a computer scientist.",
    "Adapt. Enjoy. Survive.",
    "Admiration, n.: Our polite recognition of another's resemblance to ourselves.",
    "Adolescence: The stage between puberty and adultery.",
    "Adore, v.: To venerate expectantly.",
    "Adult: One old enough to know better.",
    "Adversity makes men, prosperity monsters.",
    "Advertisement: The most truthful part of a newspaper.",
    "After Goliath's defeat, giants ceased to command respect.",
    "After all is said and done, a lot more has been said than done.",
    "Air is water with holes in it.",
    "Alas, I am dying beyond my means.",
    "Alimony and bribes will engage a large share of your wealth.",
    "All I ask is a chance to prove that money can't make me happy.",
    "All I ask of life is a constant and exaggerated sense of my own importance.",
    "All great ideas are controversial, or have been at one time.",
    "All happy families resemble one another, each unhappy in its own way.",
    "All in all it's just another brick in the wall.",
    "All my life I wanted to be someone; I guess I should have been more specific.",
    "All programmers are playwrights and all computers are lousy actors.",
    "All science is either physics or stamp collecting.",
    "All that glitters has a high refractive index.",
    "All the world's a stage and most of us are desperately unrehearsed.",
    "All things are possible except skiing through a revolving door.",
    "All true wisdom is found on T-shirts.",
    "All wise men share one trait in common: the ability to listen.",
    "Allen's Axiom: When all else fails, read the instructions.",
    "Always borrow money from a pessimist; he doesn't expect to be paid back.",
    "Always make the audience suffer as much as possible.",
    "Ambition is a poor excuse for not having sense enough to be lazy.",
    "America had often been discovered before Columbus; it had just been hushed up.",
    "America's best buy for a quarter is a telephone call to the right man.",
    "America, how can I write a holy litany in your silly mood?",
    "American Non Sequitur Society: We don't make sense. We like pizza.",
    "Amnesia used to be my favorite word, but then I forgot it.",
    "Among the chosen, you are the lucky one.",
    "Among the lucky, you are the chosen one.",
    "An Army travels on its stomach.",
    "An Englishman never enjoys himself, except for a noble purpose.",
    "An economist is a man who states the obvious in terms of the incomprehensible.",
    "An effective way to deal with predators is to taste terrible.",
    "An elephant is a mouse with an operating system.",
    "An idea is not responsible for the people who believe in it.",
    "An idle mind is worth two in the bush.",
    "An intellectual is someone whose mind watches itself.",
    "An NT server can be run by an idiot, and usually is.",
    "An object never serves the same function as its image",
    "An ounce of prevention is worth a pound of cure.",
    "Anarchy: It's not the law, it's just a good idea.",
    "And I alone am returned to wag the tail.",
    "And now for something completely different.",
    "And on the seventh day, He exited from append mode.",
    "And the Lord God said unto Moses",
    "And there's hamburger all over the highway in Mystic, Connecticut.",
    "Anger is a prelude to courage.",
    "Angular momentum makes the world go round.",
    "Ankh if you love Isis.",
    "Another good night not to sleep in a eucalyptus tree.",
    "Another one bites the dust.",
    "Anthony's Law of Force: Do not force it; get a larger hammer.",
    "Antimatter doesn't matter as a matter of fact.",
    "Antonym, n.: The opposite of the word you're trying to think of.",
    "Any clod can have the facts, but having opinions is an art.",
    "Any excuse will serve a tyrant.",
    "Any fool can paint a picture, but it takes a wise man to be able to sell it.",
    "Any fool can paint a picture, but it takes a wise person to be able to sell it.",
    "Any given program, when running correctly, is obsolete.",
    "Any job worth quitting is worth sticking around long enough until they fire you.",
    "Any shrine is better than self-worship.",
    "Any small object that is accidentally dropped will hide under a larger object.",
    "Any small object when dropped will hide under a larger object.",
    "Any smoothly functioning technology will have the appearance of magic.",
    "Any sufficiently advanced stupidity is indistinguishable from malice.",
    "Any sufficiently advanced technology is indistinguishable from a rigged demo.",
    "Any sufficiently advanced technology is indistinguishable from magic.",
    "Any two philosophers can tell each other all they know in two hours.",
    "Anybody with money to burn will easily find someone to tend the fire.",
    "Anyone can hate. It costs to love.",
    "Anyone can hold the helm when the sea is calm.",
    "Anything anybody can say about America is true.",
    "Anything free is worth what you pay for it.",
    "Anything is possible if you don't know what you're talking about.",
    "Anything worth doing is worth overdoing",
    "Anytime things appear to be going better, you have overlooked something.",
    "Are you a turtle?",
    "Arithmetic is being able to count up to twenty without taking off your shoes.",
    "Armadillo: To provide weapons to a Spanish pickle",
    "Army Axiom: An order that can be misunderstood will be misunderstood.",
    "Art is parasitic on life, just as criticism is parasitic on art.",
    "As Will Rogers would have said, \"There is no such things as a free variable.\"",
    "As Zeus said to Narcissus, \"Watch yourself.\"",
    "As far as we know, our computer has never had an undetected error.",
    "As goatherd learns his trade by goat, so writer learns his trade by wrote.",
    "As long as the answer is right, who cares if the question is wrong?",
    "As the poet said, \"Only God can make a tree\"",
    "Ashes to ashes, dust to dust, If God won't have you, the devil must.",
    "Atlee is a very modest man. And with reason.",
    "Auribus teneo lupum. (I hold a wolf by the ears.)",
    "Automobile, n.: A four-wheeled vehicle that runs up hills and down pedestrians.",
    "Automobile: A four-wheeled vehicle that runs up hills and down pedestrians.",
    "Avoid Quiet and Placid persons unless you are in Need of Sleep.",
    "Avoid letting temper block progress; keep cool.",
    "Back off, man. I'm a scientist.",
    "Badges? We don't need no stinking badges.",
    "Be careful when a loop exits to the same place from side and bottom.",
    "Be different: conform.",
    "Beauty and harmony are as necessary to you as the very breath of life.",
    "Beauty is only skin deep, but Ugly goes straight to the bone.",
    "Bees are not as busy as we think they are; they just cannot buzz any slower.",
    "Behind every argument is someone's ignorance.",
    "Behold the warranty: The bold print giveth and the fine print taketh away.",
    "Better living a beggar than buried an emperor.",
    "Between the choice of two evils, I always pick the one I've never tried before.",
    "Beware of bugs in the above code; I have only proved it correct, not tried it.",
    "Beware of Geeks bearing grifts.",
    "Beware of Programmers who carry screwdrivers.",
    "Beware of a dark-haired man with a loud tie.",
    "Beware of a tall dark man with a spoon up his nose.",
    "Beware of all enterprises that require new clothes.",
    "Beware of friends who are false and deceitful.",
    "Beware of low-flying butterflies.",
    "Beware the new TTY code!",
    "Biggest security gap - an open mouth.",
    "Biography is the fallacy of intention.",
    "Biology ... it grows on you.",
    "Birth, n.: The first and direst of all disasters.",
    "Bizarreness is the essence of the exotic",
    "Black holes are where God is dividing by zero.",
    "Blessed are the meek for they shall inhibit the earth.",
    "Blessed are they who Go Around in Circles, for they Shall be Known as Wheels.",
    "Boling's postulate: If you're feeling good, don't worry. You'll get over it.",
    "Boob's Law: You always find something in the last place you look.",
    "Bore, n.: A person who talks when you wish him to listen.",
    "Boy, n.: A noise with dirt on it.",
    "Brain fried",
    "Brain, n.: The apparatus with which we think that we think.",
    "Bride, n.: A woman with a fine prospect of happiness behind her.",
    "Bride: A woman with a fine prospect of happiness behind her.",
    "Broad-mindedness: The result of flattening high-mindedness out.",
    "Brook's Law: Adding manpower to a late software project makes it later.",
    "Bucy's Law: Nothing is ever accomplished by a reasonable man.",
    "Bug: Small living things that small living boys throw on small living girls.",
    "Bumper Sticker: Insanity is hereditary; you get it from your children.",
    "Bumper sticker on nuclear war: if you have seen one, you have seen them all.",
    "Bureaucracy is a giant mechanism operated by pygmies.",
    "Bureaucrat, n.: A politician who has tenure.",
    "Bureaucrats cut read tape",
    "Burnt Sienna: That's the best thing that ever happened to Crayolas.",
    "Business will be either better or worse.",
    "C++ : Where friends have access to your private members.",
    "CChheecckk yyoouurr dduupplleexx sswwiittcchh..",
    "Caeca invidia est. (Envy is blind.)",
    "Cahn's Axiom: When all else fails, read the instructions.",
    "California is a fine place to live",
    "California is the ghost of Christmas future for the rest of America.",
    "Call on God, but row away from the rocks.",
    "Can anyone remember when the times were not hard, and money not scarce?",
    "Can anything be sadder than work left unfinished? Yes, work never begun.",
    "Cannot fork",
    "Cannot fortune open database.",
    "Catch a wave and you're sitting on top of the world.",
    "Change is what people fear most.",
    "Change your thoughts and you change your world.",
    "Character Density: the number of very weird people in the office.",
    "Character is the ligament holding together all other qualities.",
    "Chemicals, n.: Noxious substances from which modern foods are made.",
    "Chicken Little was right.",
    "Children have more need of models than of critics.",
    "Civilization is a movement, not a condition; it is a voyage, not a harbor.",
    "Civilization is the progress toward a society of privacy.",
    "Cleanliness is next to impossible.",
    "Cogito cogito ergo cogito sum",
    "Cogito ergo doleo. (I think, therefore I am depressed.)",
    "Cogito ergo sum.",
    "College isn't the place to go for ideas.",
    "Colorless green ideas sleep furiously.",
    "Common sense in an uncommon degree is what the world calls wisdom.",
    "Complacency is the enemy of progress.",
    "Computer Science is merely the post-Turing decline in formal systems theory.",
    "Conceit causes more conversation than wit.",
    "Confidence is the feeling you have before you understand the situation.",
    "Confound these ancestors.... They've stolen our best ideas!",
    "Confusticate and bebother these dwarves!",
    "Conscience is what hurts when everything else feels so good.",
    "Conservative, n.: One who admires radicals centuries after they're dead.",
    "Controlling complexity is the essence of computer programming.",
    "Corripe Cervisiam!",
    "Corrupt, adj.: In politics, holding an office of trust or profit.",
    "Courage is grace under pressure.",
    "Coward, n.: One who in a perilous emergency thinks with his legs.",
    "Creativity cannot be diminished by the medium of expression.",
    "Creditors have better memories than debtors.",
    "Crime does not pay ... as well as politics.",
    "Culture is the habit of being pleased with the best and knowing why.",
    "Dawn, n.: The time when men of reason go to bed.",
    "De Borglie rules the wave, but Heisenberg waived the rules.",
    "Decisions terminate panic.",
    "Democracy is four wolves and a lamb, voting on what to have for lunch.",
    "Denniston's Law: Virtue is its own punishment.",
    "Deprive a mirror of its silver, and even the Czar won't see his face.",
    "Did you know gullible is not in the dictionary?",
    "Diplomacy is the art of saying \"nice doggy\" until you can find a rock.",
    "Disc space",
    "Disco is to music what Etch-A-Sketch is to art.",
    "Distress, n.: A disease incurred by exposure to the prosperity of a friend.",
    "Do not merely believe in miracles, rely on them.",
    "Do not clog intellect's sluices with bits of knowledge of questionable uses.",
    "Do not compromise yourself; you are all you have got.",
    "Do not take life too seriously; you will never get out of it alive.",
    "Do not try to solve all life's problems at once",
    "Don't be overly suspicious where it's not warranted.",
    "Don't believe everything you hear or anything you say.",
    "Don't comment bad code: rewrite it.",
    "Don't compare floating point numbers solely for equality.",
    "Don't crush that dwarf, hand me the pliers.",
    "Don't diddle code to make it faster, find a better algorithm.",
    "Dobbin's Law: When in doubt, use a bigger hammer.",
    "Don't get suckered in by the comments",
    "Don't knock President Fillmore. He kept us out of Vietnam.",
    "Don't learn the tricks of the trade, learn the trade.",
    "Don't let your mouth write no check that your tail can't cash.",
    "Don't look back, the lemmings are gaining on you.",
    "Don't tell me how hard you work. Tell me how much you get done.",
    "Doubt is not a pleasant condition, but certainty is absurd.",
    "Doubt isn't the opposite of faith; it is an element of faith.",
    "Doubts and jealousies often beget the facts they fear.",
    "Down with categorical imperative!",
    "Drawing on my fine command of language, I said nothing.",
    "Ducharme's Precept: Opportunity always knocks at the least opportune moment.",
    "Dunne's Law: The territory behind rhetoric is too often mined with equivocation.",
    "Economics is extremely useful as a form of employment for economists.",
    "Economy makes men independent.",
    "Education helps earning capacity. Ask any college professor.",
    "Eeny Meeny, Jelly Beanie, the spirits are about to speak.",
    "Eggheads unite! You have nothing to lose but your yolks.",
    "Egotism is the anesthetic that dulls the pain of stupidity.",
    "Egotist, n.: A person of low taste, more interested in himself than in me.",
    "Eighty percent of air pollution comes from plants and trees.",
    "Either do not attempt at all, or go through with it.",
    "Either that wallpaper goes, or I do.",
    "Electrocution: Burning at the stake with all the modern improvements.",
    "Elevators smell different to midgets",
    "Eloquence is vehement simplicity.",
    "Endless Loop: n., see Loop, Endless. Loop, Endless: n., see Endless Loop.",
    "Enjoy your life; be pleasant and gay, like the birds in May.",
    "Entropy isn't what it used to be.",
    "Envy always implies conscious inferiority wherever it resides.",
    "Equal bytes for women.",
    "Eschew obfuscatory digressiveness.",
    "Eternal nothingness is fine if you happen to be dressed for it.",
    "Ettore's observation: the other line moves faster.",
    "Even a cabbage may look at a king.",
    "Even a hawk is an eagle among crows.",
    "Even the boldest zebra fears the hungry lion.",
    "Even the future comes one day at a time.",
    "Even the smallest candle burns brighter in the dark.",
    "Every absurdity has a champion to defend it.",
    "Every creature has within him the wild, uncontrollable urge to punt.",
    "Every little picofarad has a nanohenry all its own.",
    "Every man is as God made him, ay, and often worse.",
    "Every program has two purposes",
    "Every program is a part of some other program, and rarely fits.",
    "Every purchase has its price.",
    "Every silver lining has a cloud around it.",
    "Every solution breeds new problems.",
    "Every word is like an unnecessary stain on silence and nothingness.",
    "Everything is better with no people.",
    "Dykstra's Law: Everybody is somebody else's weirdo.",
    "Everything to excess! Moderation is for monks.",
    "Everything you know is wrong.",
    "Everything should be built top-down, except the first time.",
    "Evolution is both fact and theory. Creationism is neither.",
    "Exactitude in small matters is the essence of discipline.",
    "Example is the school of mankind, and they will learn at no other.",
    "Excellent day to have a rotten day.",
    "Excellent time to become a missing person.",
    "Excessive login or logout messages are a sure sign of senility.",
    "Excuse me while I change into something more formidable.",
    "Executive ability is prominent in your make-up.",
    "Expense Accounts, n.: Corporate food stamps.",
    "Experience is a dear teacher, but fools will learn at no other.",
    "Experience is something you don't get until just after you need it.",
    "Experience is what causes a person to make new mistakes instead of old ones.",
    "Experience is what you get when you were expecting something else.",
    "Extreme good-naturedness borders on weakness of character. Avoid it.",
    "Extremes of fortune are fatal to folks of small dimensions.",
    "Facts do not cease to exist because they are ignored.",
    "Failure is more frequently from want of energy than want of capital.",
    "Failure is not an option. It comes bundled with your Microsoft product.",
    "Fairy Tale: A horror story to prepare children for the newspapers.",
    "Falling in love makes smoking pot all day look like the ultimate in restraint.",
    "Familiarity breeds attempt",
    "Familiarity breeds children.",
    "Familiarity breeds contempt.",
    "Fanaticism consists of redoubling your efforts when you have forgotten your aim.",
    "Far duller than a serpent's tooth it is to spend a quiet youth.",
    "Fidelity: A virtue peculiar to those who are about to be betrayed.",
    "Field theories, unite!",
    "Finagle's Creed: Science is true. Don't be misled by facts.",
    "Finagle's First Law: If an experiment works, something has gone wrong.",
    "Fine day to throw a party. Throw him as far as you can.",
    "Fine day to work off excess energy. Steal something heavy.",
    "Finster's Law: a closed mouth gathers no feet.",
    "First Law of Socio-Genetics: Celibacy is not hereditary.",
    "Flee at once: All is discovered.",
    "Follow the river and you will eventually find the sea.",
    "For a really sweet time, call C6H12O6.",
    "For every action, there is an equal and opposite criticism.",
    "For every credibility gap, there is a gullibility fill.",
    "For some reason, this fortune reminds everyone of Marvin Zelkowitz.",
    "For those who like this sort of thing, this is the sort of thing they like.",
    "Fresco's Discovery: If you knew what you were doing you'd probably be bored.",
    "Furious activity is no substitute for understanding.",
    "Garbage In",
    "Gene Police: YOU! Out of the pool!",
    "Generosity and perfection are your everlasting goals.",
    "Genius is the talent of a man who is dead.",
    "Genius may have its limitations, but stupidity is not thus handicapped.",
    "Genius: A chemist who discovers a laundry additive that rhymes with \"bright\".",
    "George Orwell was an optimist.",
    "Get forgiveness now",
    "Get hold of portable property.",
    "Give big space to the festive dog that shall sport in the roadway.",
    "Giving advice is not as risky as people say; few ever take it anyway.",
    "Go soothingly in the grease mud, as there lurks the skid demon.",
    "Go west young, man.",
    "God does not play dice with the universe.",
    "God gives us relatives; thank goodness we can choose our friends.",
    "God is a comedian playing to an audience too afraid to laugh.",
    "God is a polytheist.",
    "God is a verb, not a noun.",
    "God is an atheist.",
    "God is playing a comic to an audience that's afraid to laugh.",
    "God is real, unless declared integer.",
    "God is the tangential point between zero and infinity.",
    "God made machine language; all the rest is the work of man.",
    "God made the integers; all else is the work of Man.",
    "God made the world in six days, and was arrested on the seventh.",
    "God requireth not a uniformity of religion.",
    "Going the speed of light is bad for your age.",
    "Good advice is something a man gives when he is too old to set a bad example.",
    "Good advice is something a man gives when he is too old to set a bad example.",
    "Good leaders being scarce, following yourself is allowed.",
    "Good-bye. I am leaving because I am bored.",
    "Got Mole problems? Call Avogadro, 6.02 E23.",
    "Government expands to absorb all revenue and then some.",
    "Government sucks.",
    "Grabel's Law: 2 is not equal to 3",
    "Graduate life",
    "Greatness is a transitory experience. It is never consistent.",
    "Greener's Law: Never argue with a man who buys ink by the barrel.",
    "Half of one, six dozen of the other.",
    "Happiness adds and multiplies as we divide it with others.",
    "Happiness comes and goes and is short on staying power.",
    "Happiness is having a scratch for every itch.",
    "Happiness isn't something you experience; it's something you remember.",
    "Hardware, n.: The parts of a computer system that can be kicked.",
    "Harris' Lament: All the good ones are taken.",
    "Harris's Lament: All the good ones are taken.",
    "Hartley's Second Law: Never sleep with anyone crazier than yourself.",
    "Hatred, n.: A sentiment appropriate to the occasion of another's superiority.",
    "Have you locked your file cabinet?",
    "He hadn't a single redeeming vice.",
    "He is considered the most graceful speaker who can say nothing in most words.",
    "He is truly wise who gains wisdom from another's mishap.",
    "He looked at me as if I was a side dish he hadn't ordered.",
    "He played the king as if afraid someone else would play the ace.",
    "He that labors and thrives spins gold.",
    "He that would govern others, first should be the master of himself.",
    "He thinks by infection, catching an opinion like a cold.",
    "He walks as if balancing the family tree on his nose.",
    "He was so narrow-minded he could see through a keyhole with both eyes.",
    "He who Laughs, Lasts.",
    "He who has a shady past knows that nice guys finish last.",
    "He who has imagination without learning has wings but no feet.",
    "He who hates vices hates mankind.",
    "He who hesitates is sometimes saved.",
    "He who laughs, lasts.",
    "He who lives without folly is less wise than he believes.",
    "He who sneezes without a handkerchief takes matters into his own hands.",
    "He who spends a storm beneath a tree takes life with a grain of TNT.",
    "He who wonders discovers that this in itself is wonder.",
    "He'll sit here and he'll say, \"Do this! Do that!\" And nothing will happen.",
    "Heavy, adj.: Seduced by the chocolate side of the force.",
    "Hedonist for hire: no job too easy.",
    "Heisenberg may have slept here.",
    "Help a swallow land at Capistrano.",
    "Help stamp out, remove and abolish redundancy.",
    "Her life was saved by rock and roll.",
    "Herblock's Law: if it is good, they will stop making it.",
    "Here I am, fifty-eight, and I still don't know what I want to be when I grow up.",
    "Here at Controls, we have one chief for every Indian.",
    "Hey what? Where? When? (Are you confused as I am?)",
    "Hidden talent counts for nothing.",
    "Hindsight is an exact science.",
    "Hire the morally handicapped.",
    "His heart was yours from the first moment that you met.",
    "History does not repeat itself; historians merely repeat each other.",
    "History has the relation to truth that theology has to religion",
    "History repeats itself. That's one thing wrong with history.",
    "Hlade's Law: If you have a difficult task, give it to a lazy person",
    "Hollywood is where if you don't have happiness you send out for it.",
    "Holy Smoke, Batman, it's the Joker!",
    "Honesty pays, but it doesn't seem to pay enough to suit some people.",
    "Honi soit la vache qui rit.",
    "Horse sense is the thing a horse has which keeps it from betting on people.",
    "How about a little fire, scarecrow?",
    "How can you be in two places at once when you're not anywhere at all?",
    "How can you be two places at once when you're not anywhere at all?",
    "How come only your friends step on your new white sneakers?",
    "How does a project get to be a year late? ... One day at a time.",
    "Q. How was Thomas J. Watson buried? A. 9 edge down.",
    "Howe's Law: Everyone has a scheme that will not work.",
    "Human beings were created by water to transport it uphill.",
    "I HATE arbitrary limits, especially when they're small.",
    "I am always with myself, and it is I who am my tormenter.",
    "I am not now, and never have been, a girl friend of Henry Kissinger.",
    "I am the mother of all things, and all things should wear a sweater.",
    "I believe in getting into hot water; it keeps you clean.",
    "I belong to no organized party. I am a Democrat.",
    "I'll bet the human brain is a kludge.",
    "I can't complain, but sometimes I still do.",
    "I cannot and will not cut my conscience to fit this year's fashions.",
    "I could prove God statistically.",
    "I didn't claw my way to the top of the food chain to eat veggies.",
    "I do not fear computers. I fear the lack of them.",
    "I do not find in orthodox Christianity one redeeming feature.",
    "I do not know myself, and God forbid that I should.",
    "I don't care if I'm a lemming. I'm not going.",
    "I don't care if it works on your machine! We are not shipping your machine!",
    "I don't have any solution, but I certainly admire the problem.",
    "I don't like spreading rumors, but what else can you do with them?",
    "I either want less corruption, or more chance to participate in it.",
    "I generally avoid temptation unless I can't resist it.",
    "I go to seek a great perhaps.",
    "I had a great idea this morning but I did not like it.",
    "I had a monumental idea this morning, but I didn't like it.",
    "I hate quotations.",
    "I haven't lost my mind",
    "I haven't lost my mind; I know exactly where I left it.",
    "I just thought of something funny...your mother.",
    "I like a man who grins when he fights.",
    "I like being single. I'm always there when I need me.",
    "I like the future, I'm in it.",
    "I must have slipped a disk; my pack hurts.",
    "I never met a piece of chocolate I didn't like.",
    "I profoundly believe it takes a lot of practice to become a moral slob.",
    "I program, therefore I am.",
    "I sat through it. Why shouldn't you?",
    "I saw a werewolf drinking a pina colada at Trader Vic's.",
    "I support everyone's right to be an idiot. I may need it someday.",
    "I think Microsoft named .NET so it wouldn't show up in a Unix directory listing.",
    "I think that God in creating man somewhat overestimated his ability.",
    "I think we're all Bozos on this bus.",
    "I think you ought to know I'm feeling very depressed.",
    "I tried being reasonable once. I didn't like it.",
    "I use not only all the brains I have but all that I can borrow.",
    "I used to be indecisive; now I'm not sure.",
    "I used to get high on life but lately I've built up a resistance.",
    "I used to think I was indecisive, but now I'm not so sure.",
    "I wish they all could be California girls.",
    "I wish you humans would leave me alone.",
    "I'd give my right arm to be ambidextrous.",
    "I'm growing older, but not up.",
    "I'm in Pittsburgh. Why am I here?",
    "I'm not breaking the rules. I'm just testing their elasticity.",
    "I'm not expendable, I'm not stupid, and I'm not going.",
    "I've got a bad feeling about this.",
    "I've had fun before. This isn't it.",
    "If A = B and B = C, then A = C, except where void or prohibited by law.",
    "If God lived on Earth, people would knock out all His windows.",
    "If God is perfect, why did He create discontinuous functions?",
    "If I had a hammer, I'd use it on Peter, Paul and Mary.",
    "If I had any humility I would be perfect.",
    "If a President doesn't do it to his wife, he'll do it to his country.",
    "If a listener nods his head when you're explaining your program, wake him up.",
    "If all the world's a stage, I want to operate the trap door.",
    "If anything can go wrong, it will.",
    "If at first you don't succeed, quit; don't be a nut about success.",
    "If at first you don't succeed, redefine success.",
    "If bankers can count, how come they have eight windows and only four tellers?",
    "If entropy is increasing, where is it coming from?",
    "If everything is coming your way then you're in the wrong lane.",
    "If ignorance is bliss, why aren't there more happy people?",
    "If it ain't broke, don't fix it.",
    "If it doesn't come from you, shouldn't it come from Gerber?",
    "If it has syntax, it isn't user friendly.",
    "If it pours before seven, it has rained by eleven.",
    "If it weren't for Newton, we wouldn't have to eat bruised apples.",
    "If it's Tuesday, this must be someone else's fortune.",
    "If life is a stage, I want some better lighting.",
    "If money can't buy happiness, I guess you'll just have to rent it.",
    "If not controlled, work will flow to the competent man until he submerges.",
    "If one year is seven dog years, then one day is a dog week.",
    "If only I could be respected without having to be respectable.",
    "If someone gives you a lemon, make lemonade.",
    "If someone had told me I would be Pope one day, I would have studied harder.",
    "If something's not worth doing, it's not worth doing well.",
    "If the code and the comments disagree, then both are probably wrong.",
    "If the experiment works, you must be using the wrong equipment.",
    "If there are epigrams, there must be meta-epigrams.",
    "If there is no God, who pops up the next Kleenex?",
    "If this country is worth saving, it's worth saving at a profit.",
    "If this fortune didn't exist, somebody would have invented it.",
    "If time heals all wounds, how come the belly button stays the same?",
    "If voting could really change the system, it would be against the law.",
    "If we do not change our direction we are likely to end up where we are headed.",
    "If we do not change our direction, we might end up were we are headed.",
    "If you are not part of the solution, then you are part of the problem.",
    "If you build something a fool can use, only a fool will want it.",
    "If you can lead it to water and force it to drink, it isn't a horse.",
    "If you can't learn to do it well, learn to enjoy doing it badly.",
    "If you can't say something nice, say something surrealistic.",
    "If you cannot convince them, confuse them.",
    "If you cannot take a bird of paradise, better take a wet hen.",
    "If you don't care where you are, then you ain't lost.",
    "If you explain so clearly that nobody can misunderstand, somebody will.",
    "If you had any brains, you'd be dangerous.",
    "If you have a procedure with 10 parameters, you probably missed some.",
    "If you live in a country run by committee, be on the committee.",
    "If you make a mistake, you right it immediately to the best of your ability.",
    "If you only have a hammer, you tend to see every problem as a nail.",
    "If you see someone without a smile, give them yours.",
    "If you suspect a man, don't employ him.",
    "If you think before you speak, the other guy gets his joke in first.",
    "If you think education is expensive, try ignorance.",
    "If you think nobody cares if you're alive, try missing a couple of car payments.",
    "If you want to eat hippopotamus, you've got to pay the freight.",
    "If you'll excuse me a minute, I'm going to have a cup of coffee.",
    "If you're happy, you're successful.",
    "If you're not careful, you're going to catch something.",
    "If you're not part of the solution, you're part of the precipitate.",
    "If you're not very clever you should be conciliatory.",
    "If you've seen one Grand Canyon, you've seen them all.",
    "If you've seen one city slum, you've seen them all.",
    "If you've seen one redwood, you've seen them all.",
    "If your only tool is a hammer, every problem looks like a nail.",
    "Ignorance is the Mother of Devotion.",
    "Ignorance is when you don't know anything and somebody finds it out.",
    "Ignore previous fortune.",
    "I'll play with it first and tell you what it is later.",
    "Illinois isn't exactly the land that God forgot",
    "Imitation is the sincerest form of plagiarism.",
    "Imitation is the sincerest form of television.",
    "In an organization, each person rises to the level of his own incompetence.",
    "In marriage, as in war, it is permitted to take every advantage of the enemy.",
    "In the field of observation, chance favors only the prepared minds.",
    "[In the future], people like me will be underground and hunted.",
    "In Sedona, \"Namaste\" means \"What can I sell you?\"",
    "In the land of the dark, the Ship of the Sun is driven by the Grateful Dead.",
    "In the long run, every program becomes rococo, and then rubble.",
    "In the market, there can be no such thing as exploitation.",
    "In theory, theory and practice are the same. In practice, they're different.",
    "In this world, Truth can wait; she's used to it.",
    "Injustice anywhere is a threat to justice everywhere.",
    "Innovation is hard to schedule.",
    "Insanity is hereditary. You can catch it from your kids.",
    "Insanity is hereditary. You get it from your kids.",
    "Inside every large problem is a small problem struggling to get out.",
    "Integrity has no need for rules.",
    "Intense feeling too often obscures the truth.",
    "Iron Law of Distribution: Them that has, gets.",
    "Is life worth living? It depends on the liver.",
    "It could be worse, you could be in Cleveland.",
    "It has just been discovered that research causes cancer in rats.",
    "It is Fortune, not wisdom that rules man's life.",
    "It is a poor judge who cannot award a prize.",
    "It is a rather pleasant experience to be alone in a bank at night.",
    "It is bad luck to be superstitious.",
    "It is easier to change the specification to fit the program than vice versa.",
    "It is easier to fight for one's principles than to live up to them.",
    "It is easier to get forgiveness than permission.",
    "It is easier to run down a hill than up one.",
    "It is easier to write an incorrect program than understand a correct one.",
    "It is happier to be sometimes cheated than not to trust.",
    "It is impossible to make anything foolproof because fools are so ingenious.",
    "It is much easier to suggest solutions when you know nothing about the problem.",
    "It is much easier to suggest solutions when you know nothing about the problem.",
    "It is not best to swap horses while crossing the river.",
    "It is not enough to succeed. Others must fail.",
    "It is now 10 p.m. Do you know where Henry Kissinger is?",
    "It is now pitch dark. If you proceed, you will likely fall into a pit.",
    "It is pitch dark. You are likely to be eaten by a grue.",
    "It is surely a great calamity for a human being to have no obsessions.",
    "It is the business of little minds to shrink.",
    "It is the business of the future to be dangerous.",
    "It is the quality rather than the quantity that matters.",
    "It is the wise bird who builds his nest in a tree.",
    "It is your destiny.",
    "It just goes to show what you can do if you're a total psychotic.",
    "It looks like blind screaming hedonism won out.",
    "It may soon be time for you to look for a new line of work.",
    "It often works better if you plug it in.",
    "It seems like the less a statesman amounts to, the more he loves the flag.",
    "It seems to make an auto driver mad if he misses you.",
    "It takes a long time to understand nothing.",
    "It works better if you plug it in.",
    "It's a fine day to throw a party. Throw him as far as you can.",
    "It's a poor workman who blames his tools.",
    "It's all in the mind, ya know.",
    "It's better to burn out than it is to rust.",
    "It's better to burn out than to fade away.",
    "It's currently a problem of access to gigabits through punybaud.",
    "It's easier to fight for one's principles than to live up to them.",
    "It's easier to get forgiveness for being wrong than forgiveness for being right.",
    "It's hard to get ivory in Africa, but in Alabama the Tuscaloosa.",
    "It's later than you think.",
    "It's like deja vu all over again.",
    "It's lucky you're going so slowly, because you're going in the wrong direction.",
    "It's not an optical illusion, it just looks like one.",
    "It's not enough to be Hungarian; you must have talent too.",
    "It's not hard to meet expenses; they're everywhere.",
    "It's not reality that's important, but how you perceive things.",
    "It's smart to pick your friends - but not to pieces.",
    "It's so humid, you could poach an egg on the sidewalk.",
    "Jenkinson's Law: It won't work.",
    "Jesus may love you, but I think you're garbage wrapped in skin.",
    "Jizz changes everything. It's science!",
    "John Birch Society",
    "Jones' Motto: Friends come and go, but enemies accumulate.",
    "Jury",
    "Just because everything is different doesn't mean anything has changed.",
    "Just because you're paranoid doesn't mean they AREN'T after you.",
    "Just give Alice some pencils and she will stay busy for hours.",
    "Just once I'd like to meet an alien menace that isn't immune to bullets.",
    "Justice is incidental to law and order.",
    "Justice, like lightning, should ever appear To some men hope, to other men fear.",
    "Justice: A decision in your favor.",
    "Karl's version of Parkinson's Law: Work expands to exceed the time allotted it.",
    "Keep emotionally active. Cater to your favorite neurosis.",
    "Ketterling's Law: Logic is an organized way of going wrong with confidence.",
    "Klein bottle for rent, apply within.",
    "Know what I hate most? Rhetorical questions.",
    "Labor, n.: One of the processes by which A acquires property for B.",
    "Larkinson's Law: All laws are basically false.",
    "Laugh, and the world ignores you. Crying doesn't help either.",
    "Law of Selective Gravity: An object will fall so as to do the most damage.",
    "Lawrence's Axiom: Anger is one letter short of danger.",
    "Lead, follow, or get out of the way.",
    "Learned men are the cisterns of knowledge, not the fountainheads.",
    "Left to themselves, things tend to go from bad to worse.",
    "Lend money to a bad debtor and he will hate you.",
    "Let He who taketh the Plunge Remember to return it by Tuesday.",
    "Let me play with it first and I'll tell you what it is later.",
    "Let not the sands of time get in your lunch.",
    "Let the machine do the dirty work.",
    "Let's give discredit where discredit is due.",
    "Liar, n.: A lawyer with a roving commission.",
    "Liar: One who tells an unpleasant truth.",
    "Liberty is the mother not the daughter of order.",
    "Lie: A very poor substitute for the truth, but the only one discovered to date.",
    "Lieberman's Law: Everybody lies, but it doesn't matter since nobody listens.",
    "Life in the state of nature is solitary, poor, nasty, brutish, and short.",
    "Life is a pinball machine. You bounce around for a while, and then you drain.",
    "Life is a whim of several billion cells to be you for a while.",
    "Life is the application of noble and profound ideas to life.",
    "Life is tough, but it's tougher when you're stupid.",
    "Life is wasted on the living.",
    "Life is what happens to you while you are planning to do something else.",
    "Life's greatest gift is natural talent.",
    "Life. Don't talk to me about life.",
    "Like winter snow on summer lawn, time past is time gone.",
    "Line Printer paper is strongest at the perforations.",
    "Live every day like it's your last because someday you'll be right.",
    "Living your life is a task so difficult, it has never been attempted before.",
    "Logic is a little bird, sitting in a tree, that smells awful.",
    "Long computations which yield 0 (zero) are probably all for naught.",
    "Long distance runners break into more pants.",
    "Long life is in store for you.",
    "Look under the sofa cushion; you will be surprised at what you find.",
    "Lord, defend me from my friends; I can account for my enemies.",
    "Lots of folks confuse bad management with destiny.",
    "Love and scandal are the best sweeteners of tea.",
    "Love means never having to say, \"Put down that meat cleaver.\"",
    "Love your enemies: they'll go crazy trying to figure out what you're up to.",
    "Lowery's Law: If it jams",
    "Lubarsky's Law of Cybernetic Entomology: There's always one more bug.",
    "Luck is probability taken personally.",
    "Luck is what happens when preparation meets opportunity.",
    "Lunatic Asylum: The place where optimism most flourishes.",
    "Lynch's Law: When the going gets tough, everyone leaves.",
    "Machines take me by surprise with great frequency.",
    "Mad, adj.: Affected with a high degree of intellectual independence ...",
    "Main's Law: For every action there is an equal and opposite government program.",
    "Maintainer's Motto: If we can't fix it, it ain't broke.",
    "Majority: That quality that distinguishes a crime from a law.",
    "Make a wish: it might come true.",
    "Make input easy to proofread",
    "Make it right before you make it faster.",
    "Make sure all variables are initialized before use.",
    "Make sure comments and code agree.",
    "Make sure your code \"does nothing\" gracefully.",
    "Malek's Law: Any simple idea will be worded in the most complicated way.",
    "Man is a Generalist. Specialization is for insects.",
    "Man is a rationalizing animal, not a rational animal.",
    "Man rarely reads the handwriting on the wall until he has his back to it.",
    "Man who falls in blast furnace is certain to feel overwrought.",
    "Man's horizons are bounded by his vision.",
    "Mankind has yet to devise a rule that never requires exceptions.",
    "Many an optimist has become rich by buying out a pessimist.",
    "Many are called, few are chosen. Fewer still get to do the choosing.",
    "Many are called, few volunteer.",
    "Many are cold, but few are frozen.",
    "Many are the wonders of the Universe, and none so wonderful as Mankind!",
    "Many changes of mind and mood; do not hesitate too long.",
    "Many pages make a thick book.",
    "Many receive advice, few profit from it.",
    "Marriage is the only adventure open to the cowardly.",
    "Marshall's generalized iceberg theorem: 7/8ths of everything cannot be seen.",
    "Matter cannot be created or destroyed, nor can it be returned without a receipt.",
    "Maturity is only a short break in adolescence.",
    "Maybe Computer Science should be in the College of Theology.",
    "Measure with a micrometer. Mark with chalk. Cut with an axe.",
    "Mediocrity thrives on standardization.",
    "Meditation is not what you think.",
    "Memories of you remind me of you.",
    "Memory should be the starting point of the present.",
    "Men love to wonder, and that is the seed of science.",
    "Menu: A list of dishes which the restaurant has just run out of.",
    "Miksch's Law: If a string has one end, then it has another end.",
    "Mile's Law: where you stand depends on where you sit.",
    "Military intelligence is a contradiction in terms.",
    "Military justice is to justice what military music is to music.",
    "Mirrors should reflect a little before throwing back images.",
    "Misery loves company, but company does not reciprocate.",
    "Mistakes are often the stepping stones to utter failure.",
    "Mister Ranger isn't gonna like it, Yogi.",
    "Modern man is the missing link between the apes and humans.",
    "Modesty is an ornament, but you go further without it.",
    "Modesty is of no use to a beggar.",
    "Money is like a sixth sense, and you can't use the other five without it.",
    "Money, not morality, is the principle commerce of civilized nations.",
    "Morality is one thing. Ratings are everything.",
    "Moses supposes his toeses are roses, but Moses supposes erroneously.",
    "Mother told me to be good, but she's been wrong before.",
    "Mr. Ranger isn't gonna like it, Yogi.",
    "Muddy water let stand will clear.",
    "Murphy's Law is recursive. Washing your car to make it rain doesn't work.",
    "Murphy's Law of Research: Enough research will tend to support your theory.",
    "My answer is, bring them on.",
    "My mother is a fish.",
    "My opinions may have changed, but not the fact that I am right.",
    "My past is my own.",
    "Necessity is a mother.",
    "Neil Armstrong tripped.",
    "Never be led astray onto the path of virtue.",
    "Never call a man a fool; borrow from him.",
    "Never count your chickens before they rip your lips off.",
    "Never insult an alligator until you have crossed the river.",
    "Never invest your money in anything that eats or needs painting.",
    "Never lick a gift horse in the mouth.",
    "Never put off until tomorrow what you can avoid altogether.",
    "Never say you know a man until you have divided an inheritance with him.",
    "Never throw a bird at a dragon.",
    "Never count your chickens until they rip your lips off.",
    "New York... when civilization falls apart, remember, we were way ahead of you.",
    "New boots, big steps.",
    "New systems generate new problems.",
    "Newton's Fourth Law: Every action has an equal and opposite satisfaction.",
    "Next Wednesday you will be presented with a great opportunity.",
    "Nihilism should commence with oneself.",
    "No amount of genius can overcome a preoccupation with detail.",
    "No guts, no glory.",
    "No man's life, liberty, or property is safe while the Legislature is in session.",
    "No matter how cynical you get, it's impossible to keep up.",
    "No matter where you go, there you are.",
    "No one can feel as helpless as the owner of a sick goldfish.",
    "No one can make you feel inferior without your consent.",
    "No one is talking behind your back as far as you know.",
    "No one's happiness but my own is in my power to achieve or to destroy.",
    "No problem is insoluble in all conceivable circumstances.",
    "No problem is so formidable that you can't just walk away from it.",
    "No problem is so large it can't be fit in somewhere.",
    "No user-serviceable parts inside. Refer to qualified service personnel.",
    "Nobody can be as agreeable as an uninvited guest.",
    "Nobody can be exactly like me. Even I have trouble doing it.",
    "Nobody expects the Spanish Inquisition.",
    "Nondeterminism means never having to say you are wrong.",
    "None love the bearer of bad news.",
    "Nostalgia isn't what it used to be.",
    "Nothing astonishes men so much as common sense and plain dealing.",
    "Nothing cures insomnia like the realization that it's time to get up.",
    "Nothing ever becomes real till it is experienced",
    "Nothing in life is to be feared. It is only to be understood.",
    "Nothing is done until nothing is done.",
    "Nothing is illegal if one hundred businessmen decide to do it.",
    "Nothing is so contagious as enthusiasm: It moves stones, and it charms brutes.",
    "Nothing recedes like success.",
    "Now and then an innocent man is sent to the Legislature.",
    "Numeric stability is probably not all that important when you're guessing.",
    "O'Toole's Commentary on Murphy's Law: Murphy was an optimist.",
    "Objects on your screen are closer than they appear.",
    "Ocean, n.: A body of water occupying about two-thirds of a world made for man",
    "Of all the animals, the boy is the most unmanageable.",
    "Of all the tyrannies that affect mankind, tyranny in religion is the worst.",
    "Of course there's no reason for it, it's just our policy.",
    "Ogden's Law: The sooner you fall behind, the more time you have to catch up.",
    "Oh dear, I think you'll find reality's on the blink again.",
    "Oh, well, I guess this is just going to be one of those lifetimes.",
    "Old MacDonald had an agricultural real estate tax abatement.",
    "Old age is the most unexpected of things that can happen to a man.",
    "On a clear disk you can seek forever.",
    "One can't proceed from the informal to the formal by formal means.",
    "One man tells a falsehood, a hundred repeat it as true.",
    "One millihelen: the unit of beauty required to launch just one ship",
    "One seldom sees a monument to a committee.",
    "One thing the inventors can't seem to get the bugs out of is fresh paint.",
    "One way to stop a runaway horse is to bet on him.",
    "One's mind, stretched to a new idea, never goes back to its original dimension.",
    "Only God can make random selections.",
    "Optimization hinders evolution.",
    "Osborn's Law: Variables won't; constants aren't.",
    "Our policy is, when in doubt, do the right thing.",
    "Out of body, back in five minutes.",
    "Overdrawn? But I still have checks left!",
    "Overflow on /dev/null, please empty the bit bucket.",
    "Overload",
    "Paranoia doesn't mean the whole world really isn't out to get you.",
    "Paranoia is simply an optimistic outlook on life.",
    "Parkinson's Law: Work expands to fill the time alloted it.",
    "Patience, n. A minor form of despair, disguised as a virtue.",
    "Patriotism is the virtue of the vicious.",
    "Pay no attention to that man behind the curtains.",
    "Peace: a period of cheating between two wars.",
    "People get lost in thought because it is unfamiliar territory.",
    "People usually get what's coming to them ... unless it's been mailed.",
    "People who look down on other people do not end up being looked up to.",
    "People will buy anything that's one to a customer.",
    "Perfection is achieved only on the point of collapse.",
    "Personality can open doors, but only character can keep them open.",
    "Philogyny recapitulates erogeny; erogeny recapitulates philogyny.",
    "Philosophy: Unintelligible answers to insoluble problems.",
    "pi seconds is a nanocentury.",
    "Plagiarism is basic to all culture.",
    "Plan ahead: it was not raining when Noah built the ark.",
    "Please don't ask me what the score is. I'm not even sure what the game is.",
    "Please ignore previous fortune.",
    "Please update your programs.",
    "Pohl's law: Nothing is so good that somebody, somewhere, will not hate it.",
    "Police up your spare rounds and frags. Don't leave nothin' for the dinks.",
    "Positive, adj.: Mistaken at the top of one's voice.",
    "Power is poison.",
    "Power, n: The only narcotic regulated by the SEC instead of the FDA.",
    "Practice is the best of all instructors.",
    "Predestination was doomed from the start.",
    "Prediction is very difficult, especially of the future.",
    "Preserve the old, but know the new.",
    "Preudhomme's Law of Window Cleaning: It's on the other side.",
    "Prevent security leaks.",
    "Pro is to Con as Progress is to Congress.",
    "Proclaim liberty throughout the land and to all the inhabitants thereof.",
    "Programming is an art form that fights back.",
    "Programming is 10",
    "ingenuity and 65",
    "getting the ingenuity to work with the science.",
    "Progress is nothing but the victory of laughter over dogma.",
    "Promptness is its own reward If one lives by the clock instead of the sword.",
    "Pronounce your prepositions, dammit!",
    "Pull yourself together; things are not all that bad.",
    "Put not your trust in money, but put your money in trust.",
    "Put your trust in those who are worthy.",
    "Q. What's all wrinkled and hangs out your underwear? A. Your mom!",
    "of the pages state only \"This page intentionally left blank\", and 20",
    "Q: How many Martians does it take to screw in a lightbulb? A: One and a half.",
    "Q: Why did the tachyontac cross the road? A: Because it was on the other side.",
    "Quantity is no substitute for quality, but it's the only one we've got.",
    "Quoth the Raven, \"Never mind.\"",
    "Quotations are for people who are not saying things worth quoting.",
    "Quoting one is plagiarism. Quoting many is research.",
    "READ UNHAPPY",
    "Rage, rage, against the dying of the light!",
    "Rarely is the question asked: Is our children learning?",
    "Re: graphics: A picture is worth 10K words",
    "Reading is thinking with someone else's head instead of one's own.",
    "Real Programmers think better when playing Adventure or Rogue.",
    "Real wealth can only increase.",
    "Recent investments will yield a slight profit.",
    "Remember: You cannot drain the ocean with a teaspoon.",
    "Render unto Caesar if line 54 is larger than line 62.",
    "Replace repetitive expressions by calls to a common function.",
    "Research is what I'm doing when I don't know what I'm doing.",
    "Revolution is the opiate of the intellectuals.",
    "Ride the tributaries to reach the sea.",
    "SCCS, the source motel! Programs check in and never check out!",
    "Saints should always be judged guilty until they are proven innocent.",
    "Salad is what food eats.",
    "Satire does not look pretty upon a tombstone.",
    "Sattinger's Law: It works better if you plug it in.",
    "Science is what happens when preconception meets verification.",
    "Scott's First Law: No matter what goes wrong, it will probably look right.",
    "Semper ubi sub ubi.",
    "Serocki's Stricture: Marriage is always a bachelor's last option.",
    "Shake hands with your mother again.",
    "Short words are best, and the old words when short are best of all.",
    "Show business is just like high school, except you get paid.",
    "Silverman's Law: If Murphy's Law can go wrong, it will.",
    "Simon's Law: Everything put together falls apart sooner or later.",
    "Sin has many tools, but a lie is the handle which fits them all.",
    "Slime is the agony of water.",
    "So why don't you make like a tree, and get outta here.",
    "Society is the presumption of habit over instinct.",
    "Some cause happiness wherever they go; others, whenever they go.",
    "Some grow with responsibility, others just swell.",
    "Some men are discovered; others are found out.",
    "Some people fall for everything and stand for nothing.",
    "Sometimes I worry about being a success in a mediocre world.",
    "Sometimes a cigar is just a cigar.",
    "Sometimes the only solution is to find a new problem.",
    "Sometimes the only way out of a difficulty is through it.",
    "Sometimes, too long is too long.",
    "Speak softly and carry a +6 two-handed sword.",
    "Stability itself is nothing else than a more sluggish motion.",
    "Stay out of the road, if you want to grow old.",
    "Stock brokers invest your money until it's all gone.",
    "Stop searching. Happiness is right next to you. Now, if it'd only take a bath.",
    "Stupidity, like virtue, is its own reward.",
    "Success is a journey, not a destination.",
    "Success is not free. Neither is failure.",
    "Success is what happens when something goes right.",
    "Successful and fortunate crime is called virtue.",
    "Succumb to natural tendencies. Be hateful and boring.",
    "Superiority is always detested.",
    "Swipple's Rule of Order: He who shouts the loudest has the floor.",
    "TV is chewing gum for the eyes.",
    "Tact is the art of making a point without making an enemy.",
    "Tact is the great ability to see other people as they think you see them.",
    "Tact, n.: The unsaid part of what you're thinking.",
    "Take care of the luxuries and the necessities will take care of themselves.",
    "Take everything in stride. Trample anyone who gets in your way.",
    "Take what you can use and let the rest go by.",
    "Ten years of rejection slips is nature's way of telling you to stop writing.",
    "Than self restraint, there is nothing better.",
    "That 150 lawyers should do business together ought not to be expected.",
    "That government is best which governs least.",
    "That government is best which governs not at all.",
    "That man is richest whose pleasures are cheapest.",
    "That which is not good for the swarm, neither is it good for the bee.",
    "The Abrams' Principle: The shortest distance between two points is off the wall.",
    "The Fifth Rule: You have taken yourself too seriously.",
    "The Kennedy Constant: Don't get mad",
    "The Swartzberg Test: The validity of a science is its ability to predict.",
    "The Tree of Learning bears the noblest fruit, but noble fruit tastes bad.",
    "The advertisement is the most truthful part of a newspaper",
    "The angels wanna wear my red shoes.",
    "The applause of a single human being is of great consequence.",
    "The attacker must vanquish; the defender need only survive.",
    "The attention span of a computer is as long as its electrical cord.",
    "The best cure for anger is delay.",
    "The best prophet of the future is the past.",
    "The best thing about growing older is that it takes such a long time.",
    "The best way to break a bad habit is to drop it.",
    "The better part of maturity is knowing your goals.",
    "The biggest difference between time and space is that you can't reuse time.",
    "The chain that can be yanked is not the cosmic chain.",
    "The chief barrier to happiness is envy.",
    "The chief cause of problems is solutions.",
    "The city of the dead antedates the city of the living.",
    "The clothes have no emperor.",
    "The computing field is always in need of new cliches.",
    "The cost of living hasn't affected its popularity.",
    "The cost of living is going up, and the chance of living is going down.",
    "The debate rages on: Is PL/I Bachtrian or Dromedary?",
    "The decision didn't have to be logical, it was unanimous.",
    "The devil finds work for idle circuits to do.",
    "The difference between Genius and Stupidity is that Genius has limits.",
    "The difference between sympathy and empathy is three letters: \"yes\".",
    "The earth is like a tiny grain of sand, only much, much heavier.",
    "The end of labor is to gain leisure.",
    "The envious man grows lean at the success of his neighbor.",
    "The existence of god implies a violation of causality.",
    "The fact that it works is immaterial.",
    "The famous politician was trying to save both his faces.",
    "The fault lies not with our technologies but with our systems.",
    "The finest eloquence is that which gets things done.",
    "of a project takes 90",
    "of the time. The last 10",
    "of a project takes 90",
    "The first and great commandment is: Do not let them scare you.",
    "The first duty of a revolutionary is to get away with it.",
    "The first rule of intelligent tinkering is to save all the parts.",
    "The flow chart is a most thoroughly oversold piece of program documentation.",
    "The flush toilet is the basis of Western civilization.",
    "The following statement is true. The previous statement is false.",
    "The future isn't what it used to be. (It never was.)",
    "The generation of random numbers is too important to be left to chance.",
    "The gentlemen looked one another over with microscopic carelessness.",
    "The greatest of faults is to be conscious of none.",
    "The greatest warriors are the ones who fight for peace.",
    "The hand that rocks the cradle can also cradle a rock.",
    "The hardest thing to open is a closed mind.",
    "The heart has no rainbows when the eye has no tears.",
    "The herd instinct among economists makes sheep look like independent thinkers.",
    "The human mind ordinarily operates at only ten percent of its capacity",
    "The human mind treats a new idea the way the body treats a strange protein",
    "The ideal is impossible. The idea of the ideal is essential.",
    "The Internet? Is that thing still around?",
    "The lame in the path outstrip the swift who wander from it.",
    "The last thing one knows in constructing a work is what to put first.",
    "The life of a repo man is always intense.",
    "The life which is unexamined is not worth living.",
    "The light at the end of the tunnel is the headlight of an approaching train.",
    "The lion and the calf shall lie down together but the calf won't get much sleep.",
    "The longer I am out of office, the more infallible I appear to myself.",
    "The love of money is only one among many.",
    "The luck that is ordained for you will be coveted by others.",
    "The man who makes no mistakes does not usually make anything.",
    "The meek are contesting the will.",
    "The meek shall inherit the earth",
    "The meek shall inherit the earth, but not its mineral rights.",
    "The meek shall inherit the earth. The rest of us will go to the stars.",
    "The meek will inherit the Earth..... The rest of us will go to the stars.",
    "The mistake you make is in trying to figure it out.",
    "The moon may be smaller than Earth, but it's further away.",
    "The more things change, the more they stay insane.",
    "The more things change, the more they'll never be the same again.",
    "The more we disagree, the more chance there is that at least one of us is right.",
    "The mosquito is the state bird of New Jersey.",
    "The next six days are dangerous.",
    "The nice thing about standards is that there are so many of them to choose from.",
    "The one charm of marriage is that it makes a life of deception a necessity.",
    "The only difference between a rut and a grave is the depth.",
    "The only thing necessary for the triumph of evil is for good men to do nothing.",
    "The only things worth learning are the things you learn after you know it all.",
    "The only way to amuse some people is to slip and fall on an icy pavement.",
    "The only way to get rid of a temptation is to yield to it.",
    "The only way to learn a new programming language is by writing programs in it.",
    "The opposite of a profound truth may well be another profound truth.",
    "The optimum committee has no members.",
    "The plural of spouse is spice.",
    "The price of greatness is responsibility.",
    "The problem with the gene pool is that there is no lifeguard.",
    "The program is absolutely right; therefore the computer must be wrong.",
    "The race is not always to the swift, nor the battle to the strong",
    "The reason computer chips are so small is computers don't eat much.",
    "The revolution will not be televised.",
    "The reward of a thing well done is to have done it.",
    "The road to to success is always under construction.",
    "The secret cement of any organization is trust.",
    "The shell must break before the bird can fly.",
    "The shortest distance between two points is under construction.",
    "The silly question is the first intimation of some totally new development.",
    "The solution to a problem changes the problem.",
    "The sooner all the animals are extinct, the sooner we'll find their money.",
    "The soul would have no rainbow had the eyes no tears.",
    "The steady state of disks is full.",
    "The superfluous is very necessary.",
    "The sweetest of all sounds is praise.",
    "The time is right to make new friends.",
    "The trouble with a kitten is that When it grows up, it's always a cat",
    "The trouble with being poor is that it takes up all your time.",
    "The truth is that all those having power ought to be mistrusted.",
    "The universe is laughing behind your back.",
    "The unnatural, that too is natural.",
    "The whole earth is in jail and we're plotting this incredible jailbreak.",
    "The wife you save may be your own.",
    "The wise shepherd never trusts his flock to a smiling wolf.",
    "The world is a fantasy, so let's find out about it.",
    "The world is coming to an end. Please log off.",
    "[The World Wide Web is] the only thing I know of whose shortened form",
    "The world is no nursery.",
    "The world looks as if it has been left in the custody of trolls.",
    "The world will not recognize your talent until you demonstrate it.",
    "The world's as ugly as sin, And almost as delightful",
    "The worst form of failure is the failure to try.",
    "There ain't no such thing as a free lunch.",
    "There are a lot of lies going around.... and half of them are true.",
    "There are no bugs, only unrecognized features.",
    "There are no giant crabs in here, Frank.",
    "There are no saints, only unrecognized villains.",
    "There are 10 kinds of people. Those who know binary and those who don't.",
    "There are things that are so serious that you can only joke about them.",
    "There are two ways to write error-free programs. Only the third one works.",
    "There can be no offense where none is taken.",
    "There cannot be a crisis next week. My schedule is already full.",
    "There is a bear following you around.",
    "There is danger in delaying, good fortune in acting.",
    "There is no heavier burden than a great potential.",
    "There is no satisfaction in hanging a man who does not object to it",
    "There is no statute of limitations on stupidity.",
    "There is no substitute for good manners, except, perhaps, fast reflexes.",
    "There is no such thing as not enough time if you are doing what you want to do.",
    "There is no such thing as pure pleasure; some anxiety always goes with it.",
    "There is no time like the pleasant.",
    "There is no time like the present for postponing what you ought to be doing.",
    "There is nothing in this world constant but inconstancy.",
    "There will always be survivors.",
    "There will be big changes for you, but you will be happy.",
    "There's a bug somewhere in your code.",
    "There's a fine line between courage and foolishness. Too bad it's not a fence.",
    "There's an old proverb that says just about whatever you want it to.",
    "There's at least one fool in every married couple.",
    "There's got to be more to life than compile-and-go.",
    "There's more than one way to skin a cat: Way number 15",
    "There's more than one way to skin a cat: Way number 27",
    "There's no future in time travel",
    "There's no place like home.",
    "There's no place like $HOME.",
    "There's no point in being grown up if you can't be childish sometimes.",
    "They also surf who only stand on waves.",
    "They took some of the Van Goghs, most of the jewels, and all of the Chivas!",
    "Things are always at their best in the beginning.",
    "Things are more like they are now than they ever were before.",
    "Things are more like they used to be than they are now.",
    "Things are not as simple as they seems at first.",
    "Things won't get any better, so get used to it.",
    "Think honk if you're a telepath.",
    "This fortune intentionally not included.",
    "This fortune is false.",
    "This fortune is inoperative. Please try another.",
    "This fortune will self destruct in 5 years.",
    "This isn't brain surgery; it's just television.",
    "This space unintentionally left blank.",
    "Those who are quick in deciding are in danger of being mistaken.",
    "Those who bite the hand that feeds them usually lick the boot that kicks them.",
    "Those who can, do; those who can't, simulate.",
    "Those who can't repeat the past are condemned to remember it.",
    "Those who do not understand Unix are condemned to reinvent it, poorly.",
    "Those who talk don't know. Those who don't talk, know.",
    "Time and tide wait for no man.",
    "Time flies like an arrow. Fruit flies like a banana.",
    "Time is an illusion perpetrated by the manufacturers of space.",
    "Time is but the stream I go a-fishing in.",
    "Time is nature's way of making sure that everything doesn't happen at once.",
    "Time wounds all heels.",
    "Tip the world over on its side and everything loose will land in Los Angeles.",
    "To be awake is to be alive.",
    "To be intoxicated is to feel sophisticated but not be able to say it.",
    "To be is to program.",
    "To be overbusy is a witless task.",
    "To be perfect is to have changed often.",
    "To be wrong all the time is an effort, but some manage it.",
    "To be, or what?",
    "To do easily what is difficult for others is the mark of talent.",
    "To downgrade the human mind is bad theology.",
    "To err is human, to compute divine. Trust your computer but not its programmer.",
    "To err is human, to forgive divine.",
    "To invent, you need a good imagination and a pile of junk.",
    "To iterate is human, to recurse, divine.",
    "To know the world one must construct it.",
    "To laugh at men of sense is the privilege of fools.",
    "To program anything that is programmable is obsession.",
    "To program is to be.",
    "To steal from a thief is not theft. It is merely irony.",
    "To steal from one person is theft. To steal from many is taxation.",
    "To teach is to learn.",
    "Today is the first day of the rest of your lossage.",
    "Today is the last day of your life so far.",
    "Too clever is dumb.",
    "Too much of a good thing is WONDERFUL.",
    "Troglodytism does not necessarily imply a low cultural level.",
    "Truth has always been found to promote the best interests of mankind.",
    "Truthful, adj.: Dumb and illiterate.",
    "Try not to have a good time ... This is supposed to be educational.",
    "Try to be the best of what you are, even if what you are is no good.",
    "Tussman's Law: Nothing is as inevitable as a mistake whose time has come.",
    "Two can Live as Cheaply as One for Half as Long.",
    "Two men look out through the same bars; one sees mud, and one the stars.",
    "Two percent of zero is almost nothing.",
    "UFO's are for real: the Air Force doesn't exist.",
    "UFOs are for real. It's the Air Force that doesn't exist.",
    "Uncertain fortune is thoroughly mastered by the equity of the calculation.",
    "Uncompensated overtime? Just Say No.",
    "Underlying Principle of Socio-Genetics: Superiority is recessive.",
    "Universe, n.: The problem.",
    "UNIX *is* user friendly. It's just selective about who its friends are.",
    "Unless one is a genius, it is best to aim at being intelligible.",
    "Use GOTOs only to implement a fundamental structure.",
    "Use debugging compilers.",
    "Use free-form input where possible.",
    "Use library functions.",
    "Use the Force, Luke.",
    "Useful knowledge is a great support for intuition.",
    "VMS isn't an operating system, it's a playpen for DEC system programmers.",
    "Van Roy's Law: An unbreakable toy is useful for breaking other toys.",
    "Variables won't. Constants aren't.",
    "Very few profundities can be expressed in less than 80 characters.",
    "Vests are to suits as seat-belts are to cars.",
    "Violence is the last refuge of the incompetent.",
    "Vique's Law: A man without religion is like a fish without a bicycle.",
    "Virtue is its own punishment.",
    "Vitamin C deficiency is apauling",
    "Volcano - a mountain with hiccups.",
    "War is menstruation envy.",
    "Waste not, get your budget cut next year.",
    "Wasting time is an important part of living.",
    "Watch out for off-by-one errors.",
    "We ARE as gods and might as well get good at it.",
    "We all know that no one understands anything that isn't funny.",
    "We are all in the gutter, but some of us are looking at the stars.",
    "We are confronted with insurmountable opportunities.",
    "We are going to have peace even if we have to fight for it.",
    "We are not alone.",
    "We are what we pretend to be.",
    "We call our dog Egypt, because in every room he leaves a pyramid.",
    "We can defeat gravity. The problem is the paperwork involved.",
    "We don't care. We don't have to. We're the Phone Company.",
    "We don't know who discovered water, but we are certain it wasn't a fish.",
    "We have met the enemy and he is us",
    "We learn from history that we do not learn anything from history.",
    "We must all hang together, or we will surely all hang separately.",
    "We now return you to your regularly scheduled program.",
    "We want to create puppets that pull their own strings.",
    "We were spanking each other with meat and then suddenly it got weird.",
    "We work to become, not to acquire.",
    "We're fighting for this woman's honor, which is more than she ever did.",
    "We're here to give you a computer, not a religion.",
    "We're the weirdest monkeys ever.",
    "Weinberg's First Law: Progress is made on alternate Fridays.",
    "Welcome back, my friends, to the show that never ends!",
    "Welcome to the human race, with its wars, disease and brutality.",
    "Welcome to The Machine.",
    "Were there fewer fools, knaves would starve.",
    "What are you doing wrong with our bug-free product?",
    "What cannot be eaten must be civilized.",
    "What do you call a boomerang that doesn't work? A stick!",
    "What does it mean if there is no fortune for you?",
    "What garlic is to salad, insanity is to art.",
    "What happens when you cut back the jungle? It recedes.",
    "What is a magician but a practising theorist?",
    "What is mind? No matter. What is matter? Never mind.",
    "What is tolerance?",
    "What is vice today may be virtue tomorrow.",
    "What is virtue today may be vice tomorrow.",
    "What is worth doing is worth delegating.",
    "What is worth doing is worth the trouble of asking somebody to do.",
    "What sane person could live in this world and not be crazy?",
    "What sin has not been committed in the name of efficiency?",
    "What the large print giveth, the small print taketh away.",
    "What this calls for is a special blend of psychology and extreme violence.",
    "What this country needs is a good five cent ANYTHING!",
    "What this country needs is a good five cent microcomputer.",
    "What this country needs is a good five-cent nickel.",
    "What use is magic if it can't save a unicorn?",
    "What we anticipate seldom occurs; what we least expect generally happens.",
    "What we do not understand we do not possess.",
    "What's so funny 'bout peace, love and understanding?",
    "What boots it at one gate to make defence, And at another to let in the foe?",
    "Whatever is not nailed down is mine. What I can pry loose is not nailed down.",
    "When you are in it up to your ears, keep your mouth shut.",
    "When a Banker jumps out of a window, jump after him",
    "When a fly lands on the ceiling, does it do a half roll or a half loop?",
    "When all other means of communication fail, try words.",
    "When in doubt, do what the President does",
    "When in doubt, lead trump.",
    "When in doubt, punt.",
    "When in doubt, use brute force.",
    "When more and more people are thrown out of work, unemployment results.",
    "When the wind is great, bow before it; when the wind is heavy, yield to it.",
    "When you are alone you are all your own.",
    "When you are in it up to your ears, keep your mouth shut.",
    "When you do not know what you are doing, do it neatly.",
    "When you have an efficient government, you have a dictatorship.",
    "When you make your mark in the world, watch out for guys with erasers.",
    "Whenever anyone says, \"theoretically\", they really mean, \"not really\".",
    "Whenever people agree with me I always feel I must be wrong.",
    "Where a new invention promises to be useful, it ought to be tried",
    "Where humor is concerned there are no standards",
    "Where there's a will, there's an Inheritance Tax.",
    "Wherever you go, there you are.",
    "Whether you can hear it or not The Universe is laughing behind your back",
    "Whipit! Whipit good!",
    "Who has more leisure than a worm?",
    "Who is W. O. Baker, and why is he saying those terrible things about me?",
    "Who works achieves and who sows reaps.",
    "Whom computers would destroy, they must first drive mad.",
    "Whoso diggeth a pit shall fall therein.",
    "Why does opportunity always knock at the least opportune moment?",
    "Why isn't \"palindrome\" spelled the same way backwards?",
    "Why isn't there a special name for the tops of your feet?",
    "Wiker's Law: Government expands to absorb all available revenue and then some.",
    "Wiker's Law: Government expands to absorb revenue and then some.",
    "Will the highways on the Internet become more few?",
    "With clothes the new are best, with friends the old are best.",
    "With friends like these, who need hallucinations?",
    "With great effort, you move the rug aside, revealing a trap door.",
    "Without ice cream life and fame are meaningless.",
    "Words are the voice of the heart.",
    "Words must be weighed, not counted.",
    "Writing free verse is like playing tennis with the net down.",
    "Xerox does it again and again and again and ...",
    "Xerox never comes up with anything original.",
    "Yes, but every time I try to see things your way, I get a headache.",
    "Yes, but which self do you want to be?",
    "Yes, we have no bonanzas.",
    "You can make it illegal, but you can't make it unpopular.",
    "You can observe a lot just by watching.",
    "You can often profit from being at a loss for words.",
    "You can't antagonize and influence at the same time.",
    "You can't carve your way to success without cutting remarks.",
    "You can't depend on your eyes when your imagination is out of focus.",
    "You can't get there from here.",
    "You can't judge a book by the way it wears its hair.",
    "You can't underestimate the power of fear.",
    "You cannot achieve the impossible without attempting the absurd.",
    "You cannot build a reputation on what you are going to do.",
    "You cannot propel yourself forward by patting yourself on the back.",
    "You cannot succeed by criticizing others.",
    "You couldn't even prove the White House staff sane beyond a reasonable doubt.",
    "You don't have to explain something you never said.",
    "You don't have to think too hard when you talk to teachers.",
    "You know, you really half give me a buzz.",
    "You may call me by my name, Wirth, or by my value, Worth.",
    "You may have heard that a dean is to faculty as a hydrant is to a dog.",
    "You never know how many friends you have until you rent a house on the beach.",
    "You never finish a program, you just stop working on it.",
    "You see but you do not observe.",
    "You're never too old to become younger.",
    "Your attitude determines your attitude.",
    "Your mind understands what you have been taught; your heart, what is true.",
    "Your mother was a hamster, and your father smelt of elderberries.",
    "Your true value depends entirely on what you are compared with.",
    "Youth is the trustee of posterity.",
    "Youth is wasted on the young.",
    "Zero Defects, n.: The result of shutting down a production line.",
    "Zimmerman's Law of Complaints: Nobody notices when things go right.",
    "[Leslie Stahl was] a pussy compared to Rather.",
    "grep me no patterns and I'll tell you no lines.",
    "After all, all he did was string together a lot of old, well-known quotations.",
    "A man who can laugh, if only at himself, is never really miserable.",
    "Conscience is the inner voice which warns us that someone may be looking.",
    "Democracy is a pathetic belief in the collective wisdom of individual ignorance.",
    "I go on working for the same reason a hen goes on laying eggs.",
    "Judge: a law student who marks his own examination papers.",
    "Love is the triumph of imagination over intelligence.",
    "Never let your inferiors do you a favor. It will be extremely costly.",
    "No one ever went broke underestimating the taste of the American public.",
    "The one permanent emotion of the inferior man is fear",
    "When women kiss it always reminds one of prize-fighters shaking hands.",
    "The best way of avenging yourself is not to become like the wrong-doer.",
    "Receive wealth or prosperity without arrogance; and be ready to let it go.",
    "It is your duty to leave another man's wrongful act there, where it is.",
    "America is a ball of Appalachia with a thin coating of civility.",
    "Never work anywhere where you can't find the guy in charge and break his nose.",
    "Windows is a manifestation of commerce; Unix is a manifestation of culture.",
    "I prefer the company of men without ovaries.",
    "Be cautious of those who give you advice. That's my advice to you.",
    "If you fail to plan, you plan to fail. Sounds like a plan.",
    "If you take the easy way out, nothing will come easy.",
    "By and large, language is a tool for concealing the truth.",
    "If this is the best God can do, I'm not impressed.",
    "There are nights when the wolves are silent and only the moon howls.",
    "Don't eat yellow snow.",
    "I never set out to be weird. It was always other people who called me weird.",
    "Modern Americans behave as if intelligence were some sort of hideous deformity.",
    "Remember, there's a big difference between kneeling down and bending over.",
    "Our brains have just one scale, and we resize our experiences to fit.",
    "A monad is just a monoid in the category of endofunctors, what's the problem?",
    "Real knowledge is to know the extent of one's ignorance.",
    "Rotten wood cannot be carved.",
    "Men's natures are alike. It is their habits that carry them far apart.",
    "Our greatest glory is not in never falling, but in getting up every time we do.",
    "It does not matter how slowly you go so long as you do not stop.",
    "\"That hardly ever happens\" is another way of saying, \"It happens\".",
    "Write [code] in a way that clearly communicates your intent.",
    "Geriatric Relativity: The observation that time goes faster the older you get.",
    "I love living in the future.",
    "Salad is what food eats.",
    "Angels we have heard on High/Tell us to go out and Buy.",
    "With a rubber duck, one's never alone.",
    "Inspiration usually comes during work, rather than before it.",
    "A good photograph is knowing where to stand.",
    "A photograph is usually looked at - seldom looked into.",
    "A true photograph need not be explained, nor can it be contained in words.",
    "When in doubt, tell the truth.",
    "God made the Idiot for practice, and then He made the School Board.",
    "I was gratified to be able to answer promptly, and I did. I said I didn't know.",
    "It is the difference of opinion that makes horse races.",
    "It usually takes me more than three weeks to prepare a good impromptu speech.",
    "Man is the only animal that blushes",
    "My father was an amazing man. The older I got, the smarter he got.",
    "There is no sadder sight than a young pessimist.",
    "Under certain circumstances, profanity provides a relief denied even to prayer.",
    "Wagner's music is better than it sounds.",
    "He is now rising from affluence to poverty.",
    "A person with a new idea is a crank until the idea succeeds.",
    "A man is never more truthful than when he acknowledges himself a liar.",
    "Civilization is the limitless multiplication of unnecessary necessities.",
    "I can live for two months on a good compliment.",
    "Martyrdom covers a multitude of sins.",
    "Prosperity is the best protector of principle.",
    "The rule is perfect: in all matters of opinion our adversaries are insane.",
    "To be good is noble; but to show others how to be good is nobler and no trouble.",
    "To succeed in life, you need two things: ignorance and confidence.",
    "We have the best government that money can buy.",
    "When angry, count to four; when very angry, swear.",
    "When did ignorance become a point of view?",
    "Hey, careful, man, there's a beverage here!",
    "No matter what happens, somebody will find a way to take it too seriously.",
    "It is a miracle that curiosity survives formal education.",
    "Imagination is more important than knowledge.",
    "Never do anything against conscience even if the state demands it.",
    "The hardest thing in the world to understand is the income tax.",
    "The most incomprehensible thing about the world is that it is comprehensible.",
    "The only real valuable thing is intuition.",
    "God may be subtle, but He isn't plain mean.",
    "Common sense is the collection of prejudices acquired by age eighteen.",
    "Anyone who has never made a mistake has never tried anything new.",
    "If I had only known, I would have been a locksmith.",
    "A man should look for what is, and not for what he thinks should be.",
    "An empty stomach is not a good political adviser.",
    "As far as I'm concerned, I prefer silent vice to ostentatious virtue.",
    "Great spirits have always encountered violent opposition from mediocre minds.",
    "If you can't explain it simply, you don't understand it well enough.",
    "You can't have everything. Where would you put it?",
    "It doesn't matter what temperature a room is, it's always room temperature.",
    "What's another word for, \"thesaurus?\"",
    "Whenever I think about the past, it's just bring back so many memories.",
    "It's hard for me to buy clothes, 'cause I'm not my size.",
    "Small keyboards make for big mistakes.",
    "The older I get, the surer I am that I’m not running the show.",
    "Deprivation is the mother of poetry.",
    "We are so lightly here. It is in love that we are made. In love we disappear.",
    "There is a crack, a crack in everything. That's how the light gets in.",
    "An ounce of perversion is worth a pound of pure.",
    "That woman speaks eight languages and can't say \"no\" in any of them.",
    "I require three things in a man: he must be handsome, ruthless, and stupid.",
    "The cure for boredom is curiosity. There is no cure for curiosity.",
    "Beauty is only skin deep, but ugly goes clean to the bone.",
    "Sometimes, a grand adventure begins when you lick the evil. —Joe Pizzirusso",
    "Angels are very good at math. That's why they call them arc-angels.",
];

const GRATITUDE_PHRASES = [
    // Profound & Philosophical
    "Joy is the simplest form of gratitude",
    "Gratitude is when memory is stored in the heart and not in the mind",
    // Wisdom & Life Lessons
    "Happiness is not the absence of problems, it's the ability to deal with them",
    "Each day brings new opportunities, allowing you to constantly live with love",
    "Make a pact with yourself today to not be defined by your past",
    "Forget yesterday - it has already forgotten you",
    "At the end of the day, let there be no excuses, no explanations, no regrets",
    // Inspirational & Uplifting
    "Be mindful. Be grateful. Be positive. Be true. Be kind",
    "Pursue what catches your heart, not what catches your eyes",
    "Gratitude is the healthiest of all human emotions",
    "Gratitude shifts your perspective from lack to abundance",
    "Gratitude changes the pangs of memory into a tranquil joy",
    // Unique & Memorable
    "Gratitude is riches. Complaint is poverty",
    // Varied Shorter Ones (casual & modern)
    "Thank you for making me smile",
    "You just made everything better",
    "That was exactly what I needed",
    "You have perfect timing",
    "Consider yourself appreciated",
    "I'm in your debt",
    "Much obliged, friend",
    "You're a real one",
    "Couldn't have done it without you",
    "You came through when it mattered",
    "That's why you're the best",
    "You never disappoint",
    "Always there when I need you",
    "You make it look easy",
    "You just saved the day",
    "Absolute legend",
    "You're too good to me",
    "What would I do without you?",
    "You're the real MVP",
    "That's some top-tier help",
    "Appreciate you more than you know",
    "Thanks for having my back",
    "You're clutch",
    "Blessed to have your support",
    "You're gold",
    "Can't thank you enough for this",
    "You just brightened my whole day",
    "This means the world to me",
    "You're an absolute treasure",
    "I owe you big time",
    "You're a godsend",
    "That's incredibly kind",
    "Much appreciated, truly",
    "You're a lifesaver",
    "Thanks a million",
    "Can't express how grateful I am",
    "You're wonderful",
    "Thanks for being awesome"
];
    // =======================

    // ==== GAME READINESS CHECKER ====

    function checkGameReady() {
        if (!window.pc?.app?.root) return false;

        const player = window.pc.app.root.findByName('Player');
        if (!player) return false;

        const camera = window.pc.app.root.findByName('Camera');
        if (!camera) return false;

        const networkManager = window.pc.app.root.children[0]?.findByName('NetworkManager');
        if (!networkManager?.script?.networkManager) return false;

        try {
            const pos = player.getPosition();
            if (!pos || typeof pos.x !== 'number') return false;
        } catch (e) {
            return false;
        }

        return true;
    }

    function getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
    }

    function waitForPlayerPositionStable(callback) {
        const player = window.pc.app.root.findByName('Player');
        if (!player) {
            console.warn(`[${getTimestamp()}] [MEELAND] Player not found for position stability check`);
            callback();
            return;
        }

        let lastPos = null;
        let stableStartTime = null;
        let hasMovedFromOrigin = false;
        const startTime = Date.now();
        const maxWait = 10000;


        const checkInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;

            // Timeout check
            if (elapsed >= maxWait) {
                clearInterval(checkInterval);
                console.warn(`[${getTimestamp()}] ⚠️  Position stability timeout after ${elapsed}ms - proceeding anyway`);
                callback();
                return;
            }

            const currentPos = player.getPosition();
            const camera = window.pc.app.root.findByName('Camera');
            const cameraRotation = camera ? camera.getEulerAngles() : null;

            // Check if player has moved from origin (0, 0, 0)
            const distanceFromOrigin = Math.sqrt(
                currentPos.x * currentPos.x +
                currentPos.z * currentPos.z
            ); // Only check X/Z, ignore Y (height)

            if (!hasMovedFromOrigin) {
                if (distanceFromOrigin > 5) {
                    hasMovedFromOrigin = true;
                } else {
                    lastPos = currentPos.clone();
                    return;
                }
            }

            // Try to get player velocity if available
            let velocity = null;
            try {
                const rigidbody = player.rigidbody;
                velocity = rigidbody ? rigidbody.linearVelocity : null;
            } catch (e) {}

            if (!lastPos) {
                lastPos = currentPos.clone();
                return;
            }

            const distance = Math.sqrt(
                Math.pow(currentPos.x - lastPos.x, 2) +
                Math.pow(currentPos.y - lastPos.y, 2) +
                Math.pow(currentPos.z - lastPos.z, 2)
            );

            if (distance < POSITION_STABLE_THRESHOLD) {
                if (!stableStartTime) {
                    stableStartTime = Date.now();
                } else {
                    const stableDuration = Date.now() - stableStartTime;
                    if (stableDuration >= POSITION_STABLE_DURATION) {
                        clearInterval(checkInterval);
                        console.log(`[${getTimestamp()}] ✅ Position stable after ${elapsed}ms`);
                        callback();
                        return;
                    }
                }
            } else {
                stableStartTime = null;
                lastPos = currentPos.clone();
            }
        }, 100); // Check every 100ms
    }

    function waitForGameReady(callback) {
        const startTime = Date.now();
        let checkCount = 0;

        const checkInterval = setInterval(() => {
            checkCount++;
            const elapsed = Date.now() - startTime;

            if (checkGameReady()) {
                clearInterval(checkInterval);
                console.log(`[${getTimestamp()}] ✅ Game ready after ${elapsed}ms (${checkCount} checks)`);
                // Now wait for player position to stabilize before proceeding
                waitForPlayerPositionStable(callback);
            } else if (elapsed >= READINESS_MAX_WAIT) {
                clearInterval(checkInterval);
                console.warn(`[${getTimestamp()}] ⚠️  Game readiness timeout after ${elapsed}ms - initializing anyway`);
                callback();
            }
        }, READINESS_CHECK_INTERVAL);
    }

    // ==== UI OVERLAY ====

    // Settings management
    const SETTINGS_KEY = 'meeland_script_settings';
    const DEFAULT_SETTINGS = {
        autoLock: true,
        speedBoost: true,
        speedMultiplier: 4,
        flyMode: true,
        homeWaypoint: true,
        teleportForward: true,
        showTimer: true,
        autoEmote: true,
        famousQuotes: true,
        petStealTaunt: true
    };

    let settings = { ...DEFAULT_SETTINGS };

    function loadSettings() {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);
            if (saved) {
                settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
                // Clamp speedMultiplier to valid range
                settings.speedMultiplier = Math.max(1.5, Math.min(20, settings.speedMultiplier || 4));
            }
        } catch (e) {
            console.warn('Failed to load settings:', e);
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('Failed to save settings:', e);
        }
    }

    function updateSettingsUI() {
        document.getElementById('setting-autolock').checked = settings.autoLock;
        document.getElementById('setting-speed').checked = settings.speedBoost;
        document.getElementById('setting-speed-multiplier').value = settings.speedMultiplier;
        document.getElementById('setting-fly').checked = settings.flyMode;
        document.getElementById('setting-home').checked = settings.homeWaypoint;
        document.getElementById('setting-teleport').checked = settings.teleportForward;
        document.getElementById('setting-timer').checked = settings.showTimer;
        document.getElementById('setting-auto-emote').checked = settings.autoEmote;
        document.getElementById('setting-famous-quotes').checked = settings.famousQuotes;
        document.getElementById('setting-pet-steal-taunt').checked = settings.petStealTaunt;
    }

    function applySettings() {
        settings.autoLock = document.getElementById('setting-autolock').checked;
        settings.speedBoost = document.getElementById('setting-speed').checked;
        let multiplier = parseFloat(document.getElementById('setting-speed-multiplier').value);
        multiplier = Math.max(1.5, Math.min(20, multiplier)); // Clamp to [1.5, 20]
        settings.speedMultiplier = multiplier;
        settings.flyMode = document.getElementById('setting-fly').checked;
        settings.homeWaypoint = document.getElementById('setting-home').checked;
        settings.teleportForward = document.getElementById('setting-teleport').checked;
        settings.showTimer = document.getElementById('setting-timer').checked;
        settings.autoEmote = document.getElementById('setting-auto-emote').checked;
        settings.famousQuotes = document.getElementById('setting-famous-quotes').checked;
        settings.petStealTaunt = document.getElementById('setting-pet-steal-taunt').checked;
        saveSettings();
        updateSettingsUI();
    }


    function createControlsOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'magic-overlay';
        overlay.innerHTML = `
            <style>
                #magic-overlay {
                    position: fixed;
                    left: 10px;
                    bottom: 10px;
                    z-index: 999999;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                }

                .timer-controls {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .hotkey-info {
                    display: none;
                    background: #000;
                    border: 2px solid rgba(128, 128, 128, 0.6);
                    border-radius: 8px;
                    padding: 8px 12px;
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    color: #fff;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
                }

                #magic-overlay.show-info .hotkey-info {
                    display: block;
                }

                .hotkey-row {
                    display: flex;
                    gap: 8px;
                    margin: 3px 0;
                    align-items: center;
                }

                .hotkey-key {
                    background: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 3px;
                    padding: 2px 6px;
                    font-weight: 700;
                    font-size: 11px;
                    width: 70px;
                    text-align: center;
                    flex-shrink: 0;
                }

                .hotkey-desc {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.9);
                }

                .timer-button {
                    position: relative;
                    width: 56px;
                    height: 56px;
                    background: #000;
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 150ms ease;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
                }

                /* Hide cog button when playing */
                #magic-overlay:not(.show-info) .timer-button {
                    display: none;
                }

                .timer-button:hover {
                    transform: scale(1.05);
                    filter: brightness(1.1);
                }

                .timer-button .icon {
                    width: 32px;
                    height: 32px;
                    fill: #fff;
                }

                .timer-button .hotkey {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 22px;
                    height: 22px;
                    background: #fff !important;
                    border: 3px solid rgba(128, 128, 128, 0.8);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 700;
                    color: #000 !important;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                }

                .timer-label {
                    position: relative;
                    background: #000;
                    border: 2px solid rgba(128, 128, 128, 0.6);
                    border-radius: 10px;
                    padding: 6px 12px;
                    font-family: Arial, sans-serif;
                    font-size: 24px;
                    font-weight: 700;
                    color: #fff;
                    white-space: nowrap;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
                    transition: all 150ms ease;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
                    min-width: 80px;
                    min-height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    cursor: pointer;
                }

                /* Y badge on timer when playing */
                .timer-label::after {
                    content: 'Y';
                    position: absolute;
                    bottom: -6px;
                    right: -6px;
                    width: 24px;
                    height: 24px;
                    background: #fff !important;
                    color: #000 !important;
                    border: 3px solid rgba(128, 128, 128, 0.8);
                    border-radius: 50%;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: Arial, sans-serif;
                    font-size: 15px;
                    font-weight: 700;
                }

                /* Hide Y badge on timer when paused (cog is shown instead) */
                #magic-overlay.show-info .timer-label::after {
                    display: none;
                }

                .timer-label.unlocked {
                    color: #0f0;
                }

                .timer-label.warning {
                    color: #fa0;
                }

                .timer-label.critical {
                    color: #f33;
                    animation: criticalPulse 1s ease-in-out infinite;
                }

                .timer-label.unknown {
                    color: #999;
                }

                #settings-dialog {
                    display: none !important;
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 1000000;
                    animation: fadeIn 200ms ease-out;
                    overflow-y: auto;
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                }

                #settings-dialog.show {
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                }

                #settings-content {
                    background: linear-gradient(135deg, rgba(15, 18, 25, 0.98), rgba(20, 25, 35, 0.98));
                    border: 2px solid rgba(0, 255, 136, 0.3);
                    border-radius: 16px;
                    padding: 24px 32px;
                    min-width: 480px;
                    max-width: 90vw;
                    max-height: 85vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8),
                                0 0 0 1px rgba(0, 255, 136, 0.1) inset,
                                0 0 40px rgba(0, 255, 136, 0.1);
                    animation: slideIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                #settings-content::-webkit-scrollbar {
                    width: 8px;
                }

                #settings-content::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                }

                #settings-content::-webkit-scrollbar-thumb {
                    background: rgba(0, 255, 136, 0.3);
                    border-radius: 4px;
                }

                #settings-content::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 255, 136, 0.5);
                }

                .settings-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(0, 255, 136, 0.2);
                }

                .settings-close-x {
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: rgba(255, 80, 80, 0.15);
                    border-radius: 6px;
                    color: rgba(255, 120, 120, 0.9);
                    font-size: 20px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 150ms ease;
                    line-height: 1;
                }

                .settings-close-x:hover {
                    background: rgba(255, 80, 80, 0.3);
                    color: #fff;
                    transform: scale(1.1);
                }

                .settings-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: rgba(0, 255, 136, 0.95);
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }

                .settings-group {
                    margin-bottom: 10px;
                }

                .group-title {
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: rgba(255, 255, 255, 0.5);
                    margin-bottom: 4px;
                }

                .setting-label {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 6px 12px;
                    margin: 2px 0;
                    cursor: pointer;
                    color: rgba(245, 248, 255, 0.95);
                    font-size: 14px;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid transparent;
                    transition: all 200ms ease;
                }

                .setting-label:hover {
                    background: rgba(0, 255, 136, 0.08);
                    border-color: rgba(0, 255, 136, 0.2);
                    transform: translateX(4px);
                }

                .setting-label input[type="checkbox"] {
                    cursor: pointer;
                    width: 18px;
                    height: 18px;
                    accent-color: rgba(0, 255, 136, 0.9);
                }

                .setting-sublabel {
                    margin-left: 30px;
                    padding: 8px 14px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: rgba(245, 248, 255, 0.8);
                    font-size: 13px;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 6px;
                }

                input[type="number"] {
                    width: 80px;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    padding: 6px 12px;
                    color: white;
                    font-size: 14px;
                    transition: all 200ms ease;
                }

                input[type="number"]:focus {
                    outline: none;
                    border-color: rgba(0, 255, 136, 0.5);
                    background: rgba(255, 255, 255, 0.12);
                }

                .btn-group {
                    display: flex;
                    gap: 12px;
                    margin-top: 20px;
                    padding-top: 16px;
                    border-top: 1px solid rgba(0, 255, 136, 0.1);
                }

                .btn {
                    flex: 1;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 200ms ease;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .btn-primary {
                    background: rgba(0, 255, 136, 0.15);
                    border: 2px solid rgba(0, 255, 136, 0.4);
                    color: rgba(0, 255, 136, 1);
                }

                .btn-primary:hover {
                    background: rgba(0, 255, 136, 0.25);
                    border-color: rgba(0, 255, 136, 0.7);
                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
                    transform: translateY(-2px);
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    color: rgba(255, 255, 255, 0.8);
                }

                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                    color: rgba(255, 255, 255, 1);
                    transform: translateY(-2px);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes criticalPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            </style>
            <div class="timer-controls">
                <div class="timer-button" id="settings-btn" title="Settings (Y)">
                    <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                    </svg>
                    <div class="hotkey">Y</div>
                </div>
                <div class="timer-label" id="defense-timer">—</div>
            </div>
            <div class="hotkey-info">
                <div class="hotkey-row"><span class="hotkey-key">Y</span><span class="hotkey-desc">Settings</span></div>
                <div class="hotkey-row"><span class="hotkey-key">L</span><span class="hotkey-desc">Lock Base</span></div>
                <div class="hotkey-row"><span class="hotkey-key">Shift</span><span class="hotkey-desc">Sprint</span></div>
                <div class="hotkey-row"><span class="hotkey-key">CapsLock</span><span class="hotkey-desc">Blink</span></div>
                <div class="hotkey-row"><span class="hotkey-key">H</span><span class="hotkey-desc">Set Home</span></div>
                <div class="hotkey-row"><span class="hotkey-key">Q</span><span class="hotkey-desc">Go Home</span></div>
                <div class="hotkey-row"><span class="hotkey-key">Z</span><span class="hotkey-desc">Go Back</span></div>
                <div class="hotkey-row"><span class="hotkey-key">T</span><span class="hotkey-desc">Teleport Home</span></div>
                <div class="hotkey-row"><span class="hotkey-key">Space×2</span><span class="hotkey-desc">Fly Mode</span></div>
                <div class="hotkey-row"><span class="hotkey-key">Space</span><span class="hotkey-desc">Fly Up</span></div>
                <div class="hotkey-row"><span class="hotkey-key">F</span><span class="hotkey-desc">Fly Down</span></div>
                <div class="hotkey-row"><span class="hotkey-key">N</span><span class="hotkey-desc">Change Direction</span></div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Create settings dialog separately and append to body
        const settingsDialog = document.createElement('div');
        settingsDialog.id = 'settings-dialog';
        settingsDialog.innerHTML = `
            <div id="settings-content">
                <div class="settings-header">
                    <div class="settings-title">Configuration</div>
                    <button class="settings-close-x" id="settings-close-x" title="Close">✕</button>
                </div>

                <div class="settings-group">
                    <div class="group-title">Automation</div>
                    <label class="setting-label">
                        <input type="checkbox" id="setting-autolock" checked>
                        <span>Auto-lock base</span>
                    </label>
                    <label class="setting-label">
                        <input type="checkbox" id="setting-famous-quotes" checked>
                        <span>Famous Quotes on base lock</span>
                    </label>
                    <label class="setting-label">
                        <input type="checkbox" id="setting-pet-steal-taunt" checked>
                        <span>Taunt on pet steal</span>
                    </label>
                </div>

                <div class="settings-group">
                    <div class="group-title">Movement</div>
                    <label class="setting-label">
                        <input type="checkbox" id="setting-speed" checked>
                        <span>Sprint (Shift key)</span>
                    </label>

                    <div class="setting-sublabel">
                        <span>Multiplier:</span>
                        <input type="number" id="setting-speed-multiplier" min="1.5" max="20" step="0.5" value="4">
                        <span style="color: rgba(255,255,255,0.4); font-size: 12px;">1.5 - 20</span>
                    </div>

                    <label class="setting-label">
                        <input type="checkbox" id="setting-fly">
                        <span>Fly mode (Double jump to activate, Space=Up, F=Down)</span>
                    </label>
                </div>

                <div class="settings-group">
                    <div class="group-title">Teleportation</div>
                    <label class="setting-label">
                        <input type="checkbox" id="setting-home" checked>
                        <span>Home waypoint (Q = Go Home, Z = Go Back)</span>
                    </label>

                    <label class="setting-label">
                        <input type="checkbox" id="setting-teleport" checked>
                        <span>Blink (CapsLock)</span>
                    </label>
                </div>

                <div class="settings-group">
                    <div class="group-title">Interface</div>
                    <label class="setting-label">
                        <input type="checkbox" id="setting-timer" checked>
                        <span>Show HUD overlay</span>
                    </label>
                    <label class="setting-label">
                        <input type="checkbox" id="setting-auto-emote" checked>
                        <span>Auto-emote when idle</span>
                    </label>
                </div>

                <div class="btn-group">
                    <button id="settings-reset" class="btn btn-secondary">Reset Defaults</button>
                    <button id="settings-close" class="btn btn-primary">Save & Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(settingsDialog);

        // Settings dialog handlers
        const settingsBtn = overlay.querySelector('#settings-btn');
        const timerLabel = overlay.querySelector('#defense-timer');
        const settingsClose = settingsDialog.querySelector('#settings-close');
        const settingsCloseX = settingsDialog.querySelector('#settings-close-x');
        const settingsReset = settingsDialog.querySelector('#settings-reset');
        let wasGamePaused = false;
        let pauseCheckCount = 0;

        // Helper function to close settings with save
        function closeSettingsWithSave() {
            console.log('⚙️ Settings closing and saving');
            applySettings();
            settingsDialog.classList.remove('show');
        }

        // Helper function to open settings and release pointer lock
        function openSettingsDialog() {
            updateSettingsUI();
            settingsDialog.classList.add('show');

            // Aggressively release pointer lock
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }

            // Force blur on game canvas to release control
            const canvas = document.querySelector('canvas');
            if (canvas) {
                canvas.blur();
            }

            // Retry pointer lock exit after a short delay
            setTimeout(() => {
                if (document.pointerLockElement) {
                    document.exitPointerLock();
                }
            }, 50);

            // Ensure focus is on the dialog (not game canvas)
            setTimeout(() => {
                const header = settingsDialog.querySelector('.settings-header');
                if (header) {
                    header.click(); // Click to activate mouse
                    header.focus();
                }
            }, 100);
        }

        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('⚙️ Settings opened manually (cog)');
            openSettingsDialog();
        });

        timerLabel.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('⚙️ Settings opened manually (timer)');
            openSettingsDialog();
        });

        settingsReset.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (confirm('Reset all settings to defaults?')) {
                settings = { ...DEFAULT_SETTINGS };
                saveSettings();
                updateSettingsUI();
                console.log('🔄 Settings reset to defaults');

                // If speed boost is active, reapply with default multiplier
                if (speedBoostEnabled && settings.speedBoost) {
                    applySpeedBoost(playerScript, playerState, settings.speedMultiplier);
                }
            }
        });

        settingsClose.addEventListener('click', function closeSettings(e) {
            try {
                e.stopPropagation();
                e.preventDefault();
                console.log('⚙️ [CLOSE-1] Button clicked');

                applySettings();
                console.log('⚙️ [CLOSE-2] Settings applied');

                // If speed boost is active, reapply with new multiplier
                if (speedBoostEnabled && settings.speedBoost) {
                    console.log(`⚡ Reapplying speed boost with new multiplier: ${settings.speedMultiplier}x`);
                    applySpeedBoost(playerScript, playerState, settings.speedMultiplier);
                }
                console.log('⚙️ [CLOSE-3] About to hide dialog');

                // Hide dialog using class
                settingsDialog.classList.remove('show');

                console.log('⚙️ [CLOSE-4] Dialog hidden successfully');
            } catch (error) {
                console.error('⚙️ [CLOSE-ERROR]', error);
                // Force close even on error
                settingsDialog.classList.remove('show');
            }
            return false;
        }, true); // Use capture phase

        // X button in header - same behavior as Save & Close
        settingsCloseX.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log('⚙️ Settings closed via X button');
            applySettings();
            settingsDialog.classList.remove('show');
        });

        // Fix scroll wheel in settings dialog
        settingsDialog.addEventListener('wheel', (e) => {
            e.stopPropagation();
        }, { passive: true });

        settingsDialog.addEventListener('click', (e) => {
            // Only close if clicking directly on the background (not bubbled from content)
            if (e.target === settingsDialog) {
                console.log('⚙️ Settings closed (background click)');
                applySettings();

                // If speed boost is active, reapply with new multiplier
                if (speedBoostEnabled && settings.speedBoost) {
                    console.log(`⚡ Reapplying speed boost with new multiplier: ${settings.speedMultiplier}x`);
                    applySpeedBoost(playerScript, playerState, settings.speedMultiplier);
                }

                settingsDialog.classList.remove('show');
            }
        });

        // Auto-toggle overlay between minimized (playing) and expanded (paused)
        setTimeout(() => {
            setInterval(() => {
                pauseCheckCount++;

                // Look for pause indicators
                const playButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
                    const text = btn.textContent.trim().toUpperCase();
                    return text.includes('PLAY') || text === 'PLAY';
                });
                const visiblePlayButton = playButtons.find(btn => {
                    const rect = btn.getBoundingClientRect();
                    const style = window.getComputedStyle(btn);
                    return rect.width > 0 && rect.height > 0 &&
                           style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                });

                // Look for pause menu banners
                const pauseBanners = document.querySelectorAll('[id*="pause"]');
                const hasPauseBanner = Array.from(pauseBanners).some(el => {
                    const rect = el.getBoundingClientRect();
                    return rect.width > 0 && rect.height > 0;
                });

                const isPaused = !!visiblePlayButton || hasPauseBanner;

                // Only log state changes
                if (isPaused !== wasGamePaused) {
                    console.log(`🎮 ${isPaused ? 'PAUSED' : 'RESUMED'}`);
                }

                // Toggle overlay between minimized and expanded
                if (isPaused) {
                    // Show overlay and hotkey info when paused
                    overlay.style.display = 'flex';
                    overlay.classList.add('show-info');
                } else {
                    // When playing, respect showTimer setting
                    if (settings.showTimer) {
                        overlay.style.display = 'flex';
                    } else {
                        overlay.style.display = 'none';
                    }
                    overlay.classList.remove('show-info');
                }

                // Auto-close settings when game resumes
                if (wasGamePaused && !isPaused && settingsDialog.classList.contains('show')) {
                    settingsDialog.classList.remove('show');
                }

                wasGamePaused = isPaused;
            }, 100);
        }, 2000);

        // Add document-level Y and ESC key listeners
        document.addEventListener('keydown', (e) => {
            const isDialogOpen = settingsDialog && settingsDialog.classList.contains('show');

            // ESC key - close settings if open
            if (e.key === 'Escape' && isDialogOpen) {
                const activeElement = document.activeElement;
                // Don't interfere with input fields
                if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                console.log('⚙️ Settings closed with ESC');
                applySettings();
                settingsDialog.classList.remove('show');
                return;
            }

            // Y key - toggle settings dialog
            if (e.key === 'y' || e.key === 'Y') {
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();

                if (isDialogOpen) {
                    // Close if already open
                    console.log('⚙️ Settings closed with Y (toggle)');
                    applySettings();
                    settingsDialog.classList.remove('show');
                } else {
                    // Open if closed
                    console.log('⚙️ Settings opened with Y (document listener)');
                    openSettingsDialog();
                }
            }
        }, true);

        return overlay;
    }

    // ==== LOCKDOWN TIMER & PAD TRIGGER ====

    function findPlayerEntity() {
        try {
            const root = window.pc?.app?.root;
            if (!root) return null;

            // Try to find player by common names
            const playerNames = ['Player', 'LocalPlayer', 'MainPlayer', 'Character'];
            for (const name of playerNames) {
                const player = root.findByName(name);
                if (player) return player;
            }

            // Try to find by tag
            const playerByTag = root.findByTag?.('player')?.[0];
            if (playerByTag) return playerByTag;

            return null;
        } catch (error) {
            console.error('[REMOTE-TRIGGER] Error finding player:', error);
            return null;
        }
    }

    function getBasesScript() {
        const app = window.pc?.app;
        if (!app?.root) return null;

        const basesManager = app.root.findByName('Bases');
        if (!basesManager) return null;

        return basesManager.script?.petTycoonBasesManager || null;
    }

    function getMyBaseEntity() {
        const basesScript = getBasesScript();
        if (!basesScript?.activeBases) return null;

        const sessionId = window.pc?.sessionId;
        if (!sessionId) return null;

        for (let i = 0; i < basesScript.activeBases.length; i++) {
            const baseData = basesScript.activeBases[i];
            if (baseData.data.sessionId === sessionId) {
                return basesScript.baseEntities[baseData.data.id] || null;
            }
        }
        return null;
    }

    function getLockdownButtonScript() {
        try {
            const myBaseEntity = getMyBaseEntity();
            if (!myBaseEntity) return null;

            const buttonEntity = myBaseEntity.findByName('LockdownButton');
            if (!buttonEntity) return null;

            return buttonEntity.script?.lockdownButton || null;
        } catch (error) {
            console.error('[BUTTON-SCRIPT] Error:', error);
            return null;
        }
    }

    function getNativeTimer() {
        try {
            const buttonScript = getLockdownButtonScript();
            if (!buttonScript) return null;

            // Log available properties once for debugging
            if (!window._timerPropsLogged) {
                window._timerPropsLogged = true;
            }

            const timeLeft = buttonScript.lockdownTimeLeft || 0;
            const isActive = buttonScript.isLockdownActive || false;

            window._lockButtonScript = buttonScript;

            return (isActive && timeLeft > 0) ? timeLeft : 0;
        } catch (error) {
            console.error('[NATIVE-TIMER] Error:', error);
            return null;
        }
    }

    function getMyActivePetCount(verbose = false) {
        try {
            const basesScript = getBasesScript();
            if (!basesScript) return null;

            const petsManagerScript = basesScript.petsManagerScript;
            if (!petsManagerScript?.activePets) return null;

            const activePetsTotal = petsManagerScript.activePets.size;
            let stolenCount = 0;
            
            petsManagerScript.activePets.forEach((pet) => {
                if (pet.owner === false) {
                    stolenCount++;
                }
            });

            if (verbose) {
                const ownedCount = activePetsTotal - stolenCount;
                console.log(`[PET-ACTIVE] Total active pets: ${activePetsTotal}`);
                console.log(`[PET-ACTIVE] Owned pets (owner=true): ${ownedCount}`);
                console.log(`[PET-ACTIVE] Stolen pets (owner=false): ${stolenCount}`);
            }

            return stolenCount;
        } catch (error) {
            console.error('[PET-COUNT] Error:', error);
            return null;
        }
    }

    function triggerPadRemotely() {
        try {
            const buttonScript = getLockdownButtonScript();
            if (!buttonScript) {
                console.log(`[${getTimestamp()}] [REMOTE-TRIGGER] ❌ Button script not accessible`);
                return false;
            }

            if (typeof buttonScript.onTriggerEnter !== 'function') {
                console.log(`[${getTimestamp()}] [REMOTE-TRIGGER] ❌ onTriggerEnter method not found`);
                return false;
            }

            const player = findPlayerEntity();
            const wasEnabled = buttonScript.isEnabled;

            console.log(`[${getTimestamp()}] [REMOTE-TRIGGER] 🎯 Triggering pad... (isEnabled: ${wasEnabled})`);

            // Try multiple approaches
            try {
                if (player) {
                    buttonScript.onTriggerEnter(player);
                }
            } catch (e) {}

            try {
                buttonScript.playerNearby = true;
                if (typeof buttonScript.onPlayerEnter === 'function') {
                    buttonScript.onPlayerEnter();
                }
            } catch (e) {}

            try {
                buttonScript.onTriggerEnter();
            } catch (e) {}

            // Check if state changed (lock initiated)
            const nowEnabled = buttonScript.isEnabled;
            if (wasEnabled && !nowEnabled) {
                console.log(`[${getTimestamp()}] [REMOTE-TRIGGER] ✅ Lock initiated (isEnabled: true → false)`);
                return true;
            } else {
                console.log(`[${getTimestamp()}] [REMOTE-TRIGGER] ⚠️ No state change (isEnabled still ${nowEnabled})`);
                return false;
            }
        } catch (error) {
            console.error(`[${getTimestamp()}] [REMOTE-TRIGGER] Error:`, error);
            return false;
        }
    }

    function updateTimerDisplay(seconds) {
        const timerElement = document.getElementById('defense-timer');
        if (!timerElement) return;

        if (seconds === null || seconds === undefined) {
            timerElement.textContent = '—';
            timerElement.classList.remove('warning', 'critical', 'unlocked');
            timerElement.classList.add('unknown');
            return;
        }

        if (seconds === 0) {
            timerElement.textContent = '0:00';
            timerElement.classList.remove('warning', 'critical', 'unknown');
            timerElement.classList.add('unlocked');
            return;
        }

        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const timeStr = `${minutes}:${secs.toString().padStart(2, '0')}`;

        timerElement.textContent = timeStr;
        timerElement.classList.remove('warning', 'critical', 'unlocked', 'unknown');

        if (seconds <= 10) {
            timerElement.classList.add('critical');
        } else if (seconds <= 20) {
            timerElement.classList.add('warning');
        }
    }

    function findNetworkManager() {
        if (!window.pc?.app?.root) return null;
        const networkManager = window.pc.app.root.children[0]?.findByName('NetworkManager')?.script?.get('networkManager');
        if (!networkManager || !networkManager.room) {
            console.warn('NetworkManager not found');
            return null;
        }
        return networkManager;
    }

    function findPlayerScript(playerEntity) {
        if (!playerEntity?.script?.scripts) return null;
        const scripts = playerEntity.script.scripts;
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].speed !== undefined) return scripts[i];
        }
        console.warn('PlayerScript not found');
        return null;
    }

    function getPlayerNetworkState(networkManager) {
        if (!networkManager?.room?.state?.players) return null;
        const playerState = networkManager.room.state.players.get(networkManager.room.sessionId);
        if (!playerState) console.warn('PlayerState not found');
        return playerState;
    }

    function findCameraEntity() {
        if (!window.pc?.app?.root) return null;
        return window.pc.app.root.findByName('Camera');
    }

    function calculatePadPosition(player, camera) {
        if (!camera || !player) return null;

        const currentPos = player.getPosition().clone();

        // Pad is at current position (where player spawns)
        return new window.pc.Vec3(
            currentPos.x,
            currentPos.y,
            currentPos.z
        );
    }

    function calculateBackwardsPosition(padPos, camera) {
        if (!camera || !padPos) return null;

        const forward = camera.forward.clone();
        forward.y = 0;
        forward.normalize();

        // Move backwards from pad by PAD_DISTANCE_BEHIND
        return new window.pc.Vec3(
            padPos.x - forward.x * PAD_DISTANCE_BEHIND,
            padPos.y,
            padPos.z - forward.z * PAD_DISTANCE_BEHIND
        );
    }

    function applySpeedBoost(playerScript, playerState, multiplier) {
        if (playerScript) playerScript.speed = 7 * multiplier;
        if (playerState) playerState.movementSpeed = 1.0 * multiplier;
    }

    function resetSpeedToNormal(playerScript, playerState) {
        if (playerScript) playerScript.speed = 7;
        if (playerState) playerState.movementSpeed = 1.0;
    }

    function teleportPlayerToPosition(playerEntity, position) {
        if (playerEntity && position) {
            const beforePos = playerEntity.getPosition();
            console.log(`📍 Teleport: from (${beforePos.x.toFixed(2)}, ${beforePos.y.toFixed(2)}, ${beforePos.z.toFixed(2)}) to (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`);
            playerEntity.setPosition(position.x, position.y, position.z);

            // Force physics sync if rigidbody exists
            if (playerEntity.rigidbody) {
                playerEntity.rigidbody.teleport(position.x, position.y, position.z);
            }
        } else {
            console.error('📍 Teleport FAILED: playerEntity=', !!playerEntity, 'position=', position);
        }
    }

    function calculateForwardTeleportPosition(currentPos, camera, distance) {
        const forward = camera ? camera.forward.clone() : new window.pc.Vec3(0, 0, -1);
        forward.y = 0;
        forward.normalize();

        return new window.pc.Vec3(
            currentPos.x + forward.x * distance,
            currentPos.y,
            currentPos.z + forward.z * distance
        );
    }

    function initializeCombatModifier() {
        loadSettings();
        createControlsOverlay();
        updateSettingsUI();

        const player = findPlayerEntity();
        if (!player) {
            console.error('Cannot initialize: Player not found');
            return;
        }

        const networkManager = findNetworkManager();
        const playerScript = findPlayerScript(player);
        const playerState = networkManager ? getPlayerNetworkState(networkManager) : null;
        const camera = findCameraEntity();

        let homePos = null;
        let tempWaypoint = null;
        let lastPos = player.getPosition().clone();
        let speedBoostEnabled = false;
        let lastTimerValue = null;
        let initialLockAttempted = false;

        function tryCalculateAndTeleportHome() {
            if (homePos) return;

            homePos = calculatePadPosition(player, camera);
            if (homePos) {
                console.log(`[${getTimestamp()}] ✅ Home pad calculated:`, {
                    x: homePos.x.toFixed(2),
                    y: homePos.y.toFixed(2),
                    z: homePos.z.toFixed(2)
                });


                // Attempt to lock the base immediately (no retry delay for 100% coverage)
                if (!initialLockAttempted) {
                    initialLockAttempted = true;
                    console.log(`[${getTimestamp()}] 🔒 Attempting initial base lock...`);
                    const buttonScript = getLockdownButtonScript();
                    if (buttonScript) {
                        console.log(`[${getTimestamp()}] ✅ Button script found! Triggering pad...`);
                        triggerPadRemotely();
                    } else {
                        console.warn(`[${getTimestamp()}] ⚠️ Button script not ready (will retry in main loop)`);
                    }
                }

                // Teleport backwards IMMEDIATELY (no delay), then retry lock at backwards position
                const backwardsPos = calculateBackwardsPosition(homePos, camera);
                if (backwardsPos) {
                    console.log(`[${getTimestamp()}] ⬅️  Moving ${PAD_DISTANCE_BEHIND} tiles backwards...`);
                    teleportPlayerToPosition(player, backwardsPos);
                    homePos = calculatePadPosition(player, camera);

                    // Retry lock immediately after backwards teleport (player might need to be in this position)
                    setTimeout(() => {
                        const buttonScript = getLockdownButtonScript();
                        if (buttonScript && !buttonScript.hasTriggered) {
                            console.log(`[${getTimestamp()}] 🔒 Re-trying lock at backwards position...`);
                            triggerPadRemotely();
                        }
                    }, 10); // Minimal 10ms delay to let position register
                }
            } else {
                console.warn(`[${getTimestamp()}] ⚠️ Could not calculate home position (camera not ready?)`);
            }
        }

        // Call immediately - position is already stable when this executes
        if (settings.autoLock) {
            tryCalculateAndTeleportHome();
        }

        // Global tracking for Greasyfork promo messages (ensure at least one every 5 mins)
        window._lastGreasyforkPromo = window._lastGreasyforkPromo || 0;

        // Pet theft detection via notification interception
        if (settings.petStealTaunt && !window._petNotificationHooked) {
            // Track previous stolen count to detect actual theft events
            let previousStolenCount = 0;
            
            // Hook into PlayCanvas app.fire to intercept pet steal notifications
            const originalFire = window.pc.app.fire.bind(window.pc.app);
            window.pc.app.fire = function(event, ...args) {
                // Check for pet steal notification
                if (event === 'PetTycoon:PetStolen') {
                    const currentStolenCount = getMyActivePetCount();
                    
                    // Only taunt if stolen count actually increased (we just stole a pet)
                    if (currentStolenCount > previousStolenCount && previousStolenCount > 0) {
                        const timeSinceLastTaunt = window._lastPetTheftTaunt ? (Date.now() - window._lastPetTheftTaunt) : 999999;
                        if (timeSinceLastTaunt >= PET_THEFT_COOLDOWN_MS) {
                            const isPromo = Math.random() < 0.5;
                            const message = isPromo
                                ? GREASYFORK_PROMOS[Math.floor(Math.random() * GREASYFORK_PROMOS.length)]
                                : GRATITUDE_PHRASES[Math.floor(Math.random() * GRATITUDE_PHRASES.length)];
                            sendChatMessage(message);
                            window._lastPetTheftTaunt = Date.now();
                            if (isPromo) {
                                window._lastGreasyforkPromo = Date.now();
                            }
                        }
                    }
                    
                    // Update previous count
                    previousStolenCount = currentStolenCount;
                }
                
                return originalFire(event, ...args);
            };
            
            window._petNotificationHooked = true;
        }

        function updatePlayerState() {
            try {

                const currentPlayerPos = player.getPosition();
                if (!currentPlayerPos) {
                    console.error('[UPDATE-LOOP] player.getPosition() returned null/undefined');
                    return;
                }

                if (!lastPos) {
                    console.error('[UPDATE-LOOP] lastPos is null/undefined - initializing');
                    lastPos = currentPlayerPos.clone();
                    return;
                }

                const now = Date.now();
                const timerValue = getNativeTimer();

                if (timerValue !== null) {
                    updateTimerDisplay(timerValue);

                    // Detect when base LOCKS (timer goes from 0 to >0) - send message
                    if (timerValue > 0 && (lastTimerValue === null || lastTimerValue === 0)) {
                        // Send famous quote or promo (20% chance) when lock activates
                        // Rate limit: at most one message per minute
                        const timeSinceLastQuote = window._lastLockQuoteTime ? (now - window._lastLockQuoteTime) : 999999;
                        if (settings.famousQuotes && timeSinceLastQuote >= 60000) {
                            const isPromo = Math.random() < 0.2;
                            const message = isPromo
                                ? GREASYFORK_PROMOS[Math.floor(Math.random() * GREASYFORK_PROMOS.length)]
                                : TRADE_PHRASES[Math.floor(Math.random() * TRADE_PHRASES.length)];
                            console.log(`[${getTimestamp()}] 📢 Lock activated chat: ${message}`);
                            sendChatMessage(message);
                            window._lastLockQuoteTime = now;
                            if (isPromo) {
                                window._lastGreasyforkPromo = now;
                            }
                        }
                    }

                    // Auto-lock when base unlocks (timer hits 0)
                    if (settings.autoLock && timerValue === 0 && lastTimerValue !== null && lastTimerValue > 0) {
                        triggerPadRemotely();
                    }

                    lastTimerValue = timerValue;
                } else {
                    updateTimerDisplay(null);
                    lastTimerValue = null;
                }

                // Aggressive fallback: Check every 100ms if base is unlocked (instant response)
                if (now - (window._lastFallbackCheck || 0) >= 100) {
                    window._lastFallbackCheck = now;
                    const currentTimer = getNativeTimer();
                    if (currentTimer === 0 && settings.autoLock) {
                        triggerPadRemotely();
                    }
                }

                lastPos = currentPlayerPos.clone();

                if (speedBoostEnabled) {
                    applySpeedBoost(playerScript, playerState, settings.speedMultiplier);
                } else {
                    resetSpeedToNormal(playerScript, playerState);
                }
            } catch (error) {
                console.error('[UPDATE-LOOP] Error in updatePlayerState:', error);
            }
        }

        // Send chat message directly through the game's network layer
        // The game uses PlayCanvas and fires "NetworkManager:Send" with message type 1 for chat
        function sendChatMessage(text) {
            try {
                console.log('[CHAT] 📤 Sending message via network:', text);

                // Method 1: Direct PlayCanvas app.fire (most reliable)
                if (window.pc && window.pc.app) {
                    window.pc.app.fire('NetworkManager:Send', 1, text);
                    console.log('[CHAT] ✅ Sent via pc.app.fire');
                    return;
                }

                // Method 2: Find the app through the Application registry
                if (window.pc && window.pc.Application && window.pc.Application.getApplication) {
                    const app = window.pc.Application.getApplication();
                    if (app) {
                        app.fire('NetworkManager:Send', 1, text);
                        console.log('[CHAT] ✅ Sent via Application.getApplication()');
                        return;
                    }
                }

                // Method 3: Search for app in pc namespace
                if (window.pc) {
                    for (const key in window.pc) {
                        const obj = window.pc[key];
                        if (obj && typeof obj.fire === 'function' && obj.systems) {
                            obj.fire('NetworkManager:Send', 1, text);
                            console.log('[CHAT] ✅ Sent via pc.' + key);
                            return;
                        }
                    }
                }

                console.error('[CHAT] ❌ Could not find PlayCanvas app to send message');
            } catch (error) {
                console.error('[CHAT] ❌ Error:', error);
            }
        }

        function handleKeyDown(e) {
            // Y and ESC are handled by global listener in createControlsOverlay()

            if (e.key === '`') {
                e.preventDefault();
                e.stopPropagation();
                const randomPhrase = TRADE_PHRASES[Math.floor(Math.random() * TRADE_PHRASES.length)];
                console.log(`📢 Auto-chat sent: ${randomPhrase}`);
                sendChatMessage(randomPhrase);
                return;
            }

            if (e.key === 'Shift' && !speedBoostEnabled && settings.speedBoost) {
                speedBoostEnabled = true;
                applySpeedBoost(playerScript, playerState, settings.speedMultiplier);
            }

            if ((e.key === 'q' || e.key === 'Q') && settings.homeWaypoint) {
                tempWaypoint = player.getPosition().clone();
                console.log('📍 Home position set');

                if (!homePos) {
                    homePos = calculatePadPosition(player, camera);
                }
                if (homePos) {
                    teleportPlayerToPosition(player, homePos);
                }
            }

            if ((e.key === 'z' || e.key === 'Z') && settings.homeWaypoint) {
                if (tempWaypoint) {
                    teleportPlayerToPosition(player, tempWaypoint);
                } else {
                    console.warn('No home position set (press Q first)');
                }
            }

            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                e.stopPropagation();
                window.pc.app.fire('NetworkManager:Send', 'changePetsSpawnDirection');
                console.log('🔄 Change Direction command sent');
            }

            if (e.key === 'CapsLock' && settings.teleportForward) {
                e.preventDefault();
                const currentPos = player.getPosition();
                const newPos = calculateForwardTeleportPosition(currentPos, camera, TELEPORT_DISTANCE);
                teleportPlayerToPosition(player, newPos);
            }

            if (e.key === 't' || e.key === 'T') {
                const timerValue = getNativeTimer();
                if (timerValue !== null && timerValue > 0) {
                    const min = Math.floor(timerValue / 60);
                    const sec = Math.floor(timerValue % 60);
                    console.log(`🔒 Lock Timer: ${min}:${sec.toString().padStart(2, '0')}`);
                } else if (timerValue === 0) {
                    console.log('✅ Base is unlocked');
                } else {
                    console.log('⚠️  Timer not detected');
                }
            }
        }

        function handleKeyUp(e) {
            if (e.key === 'Shift' && speedBoostEnabled) {
                speedBoostEnabled = false;
                resetSpeedToNormal(playerScript, playerState);
            }
        }

        setInterval(updatePlayerState, 50);
        window.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('keyup', handleKeyUp, true);

        // Fly mode system - activated by double jump, deactivated on ground touch
        let flyModeActive = false;
        let flyingUp = false;
        let flyingDown = false;
        let lastJumpTime = 0;
        let jumpCount = 0;
        const DOUBLE_JUMP_WINDOW = 400;  // ms window to detect double jump
        const FLY_SPEED = 10;  // Vertical fly speed

        window.addEventListener('keydown', (e) => {
            const player = window.pc?.app?.root?.findByName('Player');
            if (!player) return;

            const kccScript = player.script?.kcc;
            if (!kccScript) return;

            // Space key - Double jump activates fly mode, then controls fly up
            if (e.code === 'Space') {
                const now = Date.now();
                
                if (flyModeActive && settings.flyMode) {
                    // Already flying, just go up
                    flyingUp = true;
                } else if (settings.flyMode) {
                    // Not flying yet - check for double jump
                    if (now - lastJumpTime < DOUBLE_JUMP_WINDOW) {
                        // Double jump detected - activate fly mode
                        flyModeActive = true;
                        kccScript.gravity = 0;
                        flyingUp = true;
                        jumpCount = 0;
                    } else {
                        // First jump
                        jumpCount = 1;
                    }
                    lastJumpTime = now;
                }
                return;
            }

            // F key - Fly down when in fly mode
            if (e.code === 'KeyF' && flyModeActive && settings.flyMode) {
                flyingDown = true;
                return;
            }
        }, true);

        window.addEventListener('keyup', (e) => {
            // Stop flying when keys are released
            if (e.code === 'Space') {
                flyingUp = false;
            }
            if (e.code === 'KeyF') {
                flyingDown = false;
            }
        }, true);

        // Continuous fly movement update & ground detection
        setInterval(() => {
            const player = window.pc?.app?.root?.findByName('Player');
            if (!player) return;

            const kccScript = player.script?.kcc;
            if (!kccScript) return;

            // Check if grounded and deactivate fly mode
            if (flyModeActive && kccScript._grounded) {
                flyModeActive = false;
                kccScript.gravity = -30; // Reset to default gravity
                flyingUp = false;
                flyingDown = false;
                jumpCount = 0;
                return;
            }

            if (!flyModeActive || !settings.flyMode) return;

            // Apply fly movement
            if (flyingUp) {
                kccScript._velY = FLY_SPEED;
            } else if (flyingDown) {
                kccScript._velY = -FLY_SPEED;
            } else {
                kccScript._velY = 0; // Stop vertical movement when no keys held
            }
        }, 16); // ~60fps update rate


        // Ensure Greasyfork promo is sent at least once every 5 minutes
        setInterval(() => {
            const now = Date.now();
            const timeSinceLastPromo = now - (window._lastGreasyforkPromo || 0);
            const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in ms
            
            if (timeSinceLastPromo >= FIVE_MINUTES) {
                const promoMessage = GREASYFORK_PROMOS[Math.floor(Math.random() * GREASYFORK_PROMOS.length)];
                console.log(`[${getTimestamp()}] ⏰ 5 minutes elapsed - sending Greasyfork promo: ${promoMessage}`);
                sendChatMessage(promoMessage);
                window._lastGreasyforkPromo = now;
            }
        }, 60000); // Check every minute

        // Auto-emote when idle
        const EMOTE_NAMES = ["Waving", "Breakdance", "Macarena", "Shuffle", "Smooth Moves", "Techno"];
        let lastPlayerPos = null;
        let idleStartTime = 0;
        let nextEmoteTime = 0;
        let hasEmotedThisIdleSession = false;

        function getRandomEmoteDelay() {
            return 5000 + Math.random() * 15000; // 5-20 seconds
        }

        setInterval(() => {
            // Skip if auto-emote disabled
            if (!settings.autoEmote) return;

            const player = window.pc?.app?.root?.findByName('Player');
            if (!player) return;

            const emoteScript = player.script?.emote;
            if (!emoteScript) return;

            // Skip if already emoting
            if (emoteScript.isEmoting) return;

            const currentPos = player.getPosition();
            const now = Date.now();

            // Check if player moved
            if (lastPlayerPos) {
                const dx = currentPos.x - lastPlayerPos.x;
                const dy = currentPos.y - lastPlayerPos.y;
                const dz = currentPos.z - lastPlayerPos.z;
                const moved = Math.sqrt(dx*dx + dy*dy + dz*dz) > 0.1;

                if (moved) {
                    // Player moved, reset idle timer
                    idleStartTime = now;
                    hasEmotedThisIdleSession = false;
                    nextEmoteTime = now + 2000; // First emote after 2 seconds
                } else if (now >= nextEmoteTime && idleStartTime > 0) {
                    // Player has been idle long enough, trigger emote
                    const randomEmote = EMOTE_NAMES[Math.floor(Math.random() * EMOTE_NAMES.length)];
                    emoteScript.onPlay(randomEmote);
                    hasEmotedThisIdleSession = true;
                    nextEmoteTime = now + getRandomEmoteDelay(); // Subsequent emotes: 5-20 seconds
                }
            } else {
                // First run, initialize
                idleStartTime = now;
                nextEmoteTime = now + 2000; // First emote after 2 seconds
            }

            lastPlayerPos = {x: currentPos.x, y: currentPos.y, z: currentPos.z};
        }, 1000); // Check every second

        console.log(`[${getTimestamp()}] ✅ Meeland Script v3.60 Active - ${TRADE_PHRASES.length} Trade Phrases Loaded`);
        console.log(`[${getTimestamp()}] 🔄 Update loop started (50ms interval)`);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            waitForGameReady(initializeCombatModifier);
        });
    } else {
        waitForGameReady(initializeCombatModifier);
    }
})();
