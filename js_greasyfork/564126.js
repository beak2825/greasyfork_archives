// ==UserScript==
// @name         Torn Job Interview
// @namespace    torn.com
// @version      1.0
// @description  Highlights correct answer in city job
// @author       SuperGogu [3580072]
// @match        https://www.torn.com/joblist.php*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564126/Torn%20Job%20Interview.user.js
// @updateURL https://update.greasyfork.org/scripts/564126/Torn%20Job%20Interview.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    .sg-jobhl-correct {
      outline: 2px solid #2ecc71 !important;
      box-shadow: 0 0 0 2px rgba(46,204,113,0.25) !important;
      border-radius: 6px !important;
      background: rgba(46,204,113,0.12) !important;
    }
    .sg-jobhl-wrong-dim {
      opacity: 0.35 !important;
      filter: grayscale(0.35) !important;
    }
    .sg-jobhl-notfound {
      outline: 2px solid #f39c12 !important;
      box-shadow: 0 0 0 2px rgba(243,156,18,0.25) !important;
      border-radius: 6px !important;
    }
    .sg-jobhl-badge {
      display: inline-block;
      margin-left: 8px;
      padding: 1px 6px;
      border-radius: 10px;
      font-size: 11px;
      line-height: 16px;
      font-weight: 700;
      background: rgba(46,204,113,0.18);
      outline: 1px solid rgba(46,204,113,0.55);
    }
  `);

  const RAW = {
    army: [
      ["When a soldier mentions 'Brain bucket', what is he referring to?", ["A helmet", "Helmet"]],
      ["When did World War 2 start?", ["1939"]],
      ["Fill in the gaps: This is my rifle, this is my gun, this is for ______ and this is for ______.", ["Fighting, Fun", "Fighting, fun", "Fighting and Fun", "Fighting and fun"]],
      ["A 'jarhead' refers to what?", ["United States Marine", "US Marine", "United States Marine Corps"]],
      ["What does 'USMC' stand for?", ["United States Marine Corps"]],
      ["In the United States, which is the higher rank in the Army?", ["General"]],
      ["What does the acronym 'RPG' stand for?", ["Rocket propelled grenade", "Rocket-propelled grenade"]],
      ["Which of the following is NOT a rank in the US army?", ["Admiral"]],
      ["Against which of the following countries has America NEVER been at war with? Don't forget about World War 2 or the American Revolutionary War!", ["France"]]
    ],
    grocer: [
      ["Which one of these fruits does not grow on tree?", ["Strawberries", "Strawberry"]],
      ["Which of these are not a stone fruit?", ["Pear", "Pears"]],
      ["A customer cannot find what they're looking for in the store, what do you tell them?", ["Tell them to leave their name and number, and we'll order it in for them."]],
      ["Argueably, which of these fruits cannot be rhymed with any other word?", ["Orange"]],
      ["When is the customer right?", ["The customer is always right."]],
      ["A customer has stolen some produce and is walking out of the door, what should you do?", ["Call the police immediately."]],
      ["A customer hands you the money for their products, what do you do?", ["Place the money in the till, and give the customer their change."]],
      ["Some of the produce is starting to go dangerously rotten. What should you do?", ["Immediately dispose of the rotting produce."]],
      ["What fruit is frequently mistaken as a vegetable?", ["Tomato"]]
    ],
    casino: [
      ["The common currency used in casinos are known as what?", ["Chips"]],
      ["What is the nickname for the overhead camera that monitors player and dealer behaviour in a casino?", ["Eye in the Sky"]],
      ["Which of these is a type of poker game?", ["Texas Hold'em", "Texas Holdem"]],
      ["In blackjack what is the lowest number the dealer does NOT hit on?", ["17"]],
      ["In poker, which of the following is the better hand?", ["Royal Flush"]],
      ["In poker, which of these hands would NOT beat a pair of fives?", ["A Pair of twos", "Pair of twos"]],
      ["Which of these is not usually found in a casino?", ["A clock", "Clock"]],
      ["In the bookies, which odds would provide a bigger payout for the gambler?", ["50 / 1", "50/1"]],
      ["A customer wants to 'cash out', what does this mean?", ["Exchange their credit back to cash and leave"]]
    ],
    law: [
      ["In court, what is the purpose of the jury?", ["To give a true verdict based on evidence presented"]],
      ["What is the highest court a case can escalate to in the U.S.?", ["Supreme Court", "The Supreme Court"]],
      ["A malicious act to intentionally cause damage to property is called what?", ["Vandalism"]],
      ["How do you start a civil action?", ["File a complaint with the court."]],
      ["What Is A 'Plea Bargain'?", ["An incentive for a defendant to plead guilty"]],
      ["If a person has been convicted of a crime and is hiding from the law they are known as?", ["Fugitive from Justice", "Fugitive"]],
      ["A breach of your right, or a civil wrong against you is called what?", ["Tort"]],
      ["What is the usual basis for filing a civil lawsuit?", ["Negligence, intentional acts or breach of contract."]],
      ["what crime is the only crime that doesn't occur during full moon?", ["Murder"]]
    ],
    medical: [
      ["A patient has an embedded object in their arm and it has penetrated an artery. How would you treat it?", ["Apply a dressing around the object and get them to a hospital."]],
      ["How much blood is in the average adult?", ["5 liters", "5 litres"]],
      ["Tachycardia refers to what?", ["An accelerated heart rate", "Accelerated heart rate"]],
      ["What is the femur?", ["Thigh bone"]],
      ["Someone has dropped, clutching their throat choking... what should you do?", ["Perform the Heimlich Maneuver.", "Perform the Heimlich manoeuvre."]],
      ["How many bones does an adult human have?", ["206"]],
      ["DRE is an examination where a well lubricated finger is placed where?", ["Rectum", "The rectum"]],
      ["What is the normal core body temperature?", ["37.0 degrees celsius", "37 degrees celsius", "37°C", "37 C"]],
      ["What does the term 'Soldiers disease' stand for?", ["Morphine addiction"]]
    ],
    education: [
      ["If someone is deemed 'illiterate', what does this mean?", ["They cannot read or write."]],
      ["Fill the gap. We were walking down the road and ___ was a loud noise.", ["There."]],
      ["One of your students is bullying another pupil, what should you do?", ["Put the bully in detention and send a letter home."]],
      ["An adverb is what?", ["A word describing an action such as 'beautifully", "A word describing an action such as 'beautifully'"]],
      ["X + 15 = 27. What is X?", ["12"]],
      ["Complete this line from a poem... Quoth the raven ____.", ["Never more.", "Nevermore.", "Never more"]],
      ["Choose the correct spelling.", ["Miscellaneous"]],
      ["A little girl has fallen over in the playcourt and cut her knee... What should you do?", ["Send her to the school nurse."]],
      ["What does 'SAT', a certain test for college admissions, stand for?", ["Scholastic Aptitude Test"]]
    ]
  };

  const norm = (s) => String(s || '')
    .replace(/[“”„‟"]/g, '"')
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  const normAnswer = (s) => norm(s)
    .replace(/[.?!]+$/g, '')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*\/\s*/g, '/');

  const tokenize = (s) => {
    const w = norm(s).replace(/[^a-z0-9' ]+/g, ' ').split(' ').filter(Boolean);
    return new Set(w);
  };

  const QA = (() => {
    const out = {};
    for (const job of Object.keys(RAW)) {
      const m = new Map();
      for (const [q, ansList] of RAW[job]) {
        const k = norm(q).replace(/[.?!]+$/g, '');
        m.set(k, (ansList || []).map(normAnswer));
      }
      out[job] = m;
    }
    return out;
  })();

  const getHashParams = () => {
    const h = String(location.hash || '').replace(/^#?!?/, '');
    return new URLSearchParams(h);
  };

  const isInterviewRoute = () => {
    const p = getHashParams();
    return norm(p.get('p')) === 'interview';
  };

  const getJobType = () => {
    const p = getHashParams();
    return norm(p.get('job'));
  };

  const getQuestionText = () => {
    const blocks = Array.from(document.querySelectorAll('.interviewer-wrap.dialog .speech-wrap'));
    const el = blocks.length ? blocks[blocks.length - 1] : null;
    if (!el) return '';
    let t = (el.textContent || '').replace(/\s+/g, ' ').trim();
    t = t.replace(/^[^:]{1,80}:\s*/, '');
    t = t.replace(/[“”„‟"]/g, '').trim();
    return t;
  };

  const bestQuestionMatch = (job, question) => {
    const m = QA[job];
    if (!m) return null;

    const qKey = norm(question).replace(/[.?!]+$/g, '');
    const direct = m.get(qKey);
    if (direct) return direct;

    const qSet = tokenize(question);
    const qSize = Math.max(qSet.size, 1);
    let best = null;
    let bestScore = 0;

    for (const [k, ans] of m.entries()) {
      const kSet = tokenize(k);
      let common = 0;
      for (const w of qSet) if (kSet.has(w)) common++;
      const score = common / qSize;
      if (score > bestScore) {
        bestScore = score;
        best = ans;
      }
    }

    if (best && bestScore >= 0.72) return best;
    return null;
  };

  const clearMarks = () => {
    document.querySelectorAll('.interviewer-wrap.answer').forEach((w) => {
      w.classList.remove('sg-jobhl-correct', 'sg-jobhl-notfound', 'sg-jobhl-wrong-dim');
      const b = w.querySelector('.sg-jobhl-badge');
      if (b) b.remove();
    });
  };

  let lastSig = '';
  let scheduled = 0;
  let applying = false;

  const buildSignature = () => {
    const job = getJobType();
    const q = norm(getQuestionText());
    const answers = Array.from(document.querySelectorAll('.interviewer-wrap.answer a')).map(a => normAnswer(a.textContent));
    return `${job}||${q}||${answers.join('||')}||${GM_getValue('sg_jobhl_dim_wrong', true) ? '1' : '0'}`;
  };

  const applyHighlight = () => {
    if (!isInterviewRoute()) return;

    const job = getJobType();
    if (!job || !QA[job]) return;

    const question = getQuestionText();
    if (!question) return;

    const wrappers = Array.from(document.querySelectorAll('.interviewer-wrap.answer'));
    if (!wrappers.length) return;

    const answersExpected = bestQuestionMatch(job, question);
    const dimWrong = !!GM_getValue('sg_jobhl_dim_wrong', true);

    clearMarks();

    if (!answersExpected || !answersExpected.length) {
      wrappers.forEach(w => w.classList.add('sg-jobhl-notfound'));
      return;
    }

    const expectedSet = new Set(answersExpected.map(normAnswer));
    let found = false;

    const isMatch = (n) => {
      if (expectedSet.has(n)) return true;
      for (const exp of expectedSet) {
        if (n === exp) return true;
        if (n.includes(exp) || exp.includes(n)) return true;
      }
      return false;
    };

    wrappers.forEach((w) => {
      const a = w.querySelector('a');
      const txt = a ? a.textContent : '';
      const n = normAnswer(txt);
      if (isMatch(n)) {
        w.classList.add('sg-jobhl-correct');
        const badge = document.createElement('span');
        badge.className = 'sg-jobhl-badge';
        badge.textContent = 'Correct';
        if (a) a.appendChild(badge);
        found = true;
      }
    });

    if (dimWrong) {
      wrappers.forEach((w) => {
        if (!w.classList.contains('sg-jobhl-correct')) w.classList.add('sg-jobhl-wrong-dim');
      });
    }

    if (!found) {
      wrappers.forEach(w => w.classList.add('sg-jobhl-notfound'));
    }
  };

  const run = () => {
    if (applying) return;
    const sig = buildSignature();
    if (sig === lastSig) return;
    lastSig = sig;

    applying = true;
    try {
      applyHighlight();
    } finally {
      applying = false;
    }
  };

  const scheduleRun = () => {
    if (scheduled) return;
    scheduled = window.setTimeout(() => {
      scheduled = 0;
      run();
    }, 120);
  };

  const attachObserver = () => {
    const target = document.querySelector('.content-wrapper') || document.body;
    const mo = new MutationObserver(() => {
      if (applying) return;
      scheduleRun();
    });
    mo.observe(target, { childList: true, subtree: true });
    return mo;
  };

  const setupMenu = () => {
    GM_registerMenuCommand('Toggle dim incorrect answers', () => {
      const v = !!GM_getValue('sg_jobhl_dim_wrong', true);
      GM_setValue('sg_jobhl_dim_wrong', !v);
      lastSig = '';
      scheduleRun();
    });
    GM_registerMenuCommand('Refresh highlight', () => {
      lastSig = '';
      scheduleRun();
    });
  };

  setupMenu();
  attachObserver();
  window.addEventListener('hashchange', () => {
    lastSig = '';
    scheduleRun();
  }, { passive: true });

  scheduleRun();
})();
