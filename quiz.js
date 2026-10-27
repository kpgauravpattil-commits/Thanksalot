const quizData = [
    { question: "I've posted Resident Evil stuff for the 47th time this week. What's the most likely explanation?", options: ["I'm hoping Capcom notices me and hires me.", "It's 90% because of Claire Redfield.", "I'm genuinely trying to explain the complex lore to everyone.", "I just like watching Leon suffer."], correctAnswer: 1, reaction: "The evidence on my timeline was overwhelming. Case closed." },
    { question: "Imagine the zombie apocalypse starts in a game I'm playing. What's my most predictable behaviour?", options: ["Sprint to the nearest safe room and save immediately.", "Spend 10 minutes finding the perfect angle for a cinematic screenshot.", "Actually try to survive and conserve my ammo.", "Google the walkthrough so I don't get scared."], correctAnswer: 1, reaction: "Priorities questionable. Composition immaculate." },
    { question: "I open a visually stunning game for a 'quick session'. What happens an hour later?", options: ["I've finished three main story missions.", "I'm exploring every corner of the map for hidden items.", "I haven't moved past the first hallway because the lighting was too good not to screenshot.", "I spent the whole time tweaking the graphics settings."], correctAnswer: 2, reaction: "The mission can wait. The lighting cannot." },
    { question: "Something completely random or buggy happens to me while gaming. What do I do?", options: ["Ignore it and keep playing like a normal person.", "Turn it into a highly dramatic meme or cinematic post.", "Rant about it in a 40-page review.", "Reload the save because it ruined my immersion."], correctAnswer: 1, reaction: "Some people play games. Some people produce cinema. Apparently." },
    { question: "I pick up my phone to check ONE specific thing. What is the most likely outcome?", options: ["I do that exact thing and put the phone down.", "I open Instagram, forget why I opened it, and close it again.", "I immediately start replying to all my unread messages.", "It's suddenly 2 AM and I'm watching a video essay on a topic I don't care about."], correctAnswer: 3, reaction: "The original task was just a side quest." },
    { question: "The social battery test: I'm typing out a whole paragraph to reply to someone, but my social battery dies. What happens?", options: ["I send the paragraph exactly as written.", "I delete everything and just reply with 'lmao'.", "I leave them on read and go to sleep.", "I close the chat, mean to reply later, and remember three business days later."], correctAnswer: 3, reaction: "Reply pending. Estimated delivery: next financial year." },
    { question: "The final boss: I have ₹500, a Steam sale is happening, and I specifically said I wasn't buying anything. What happens?", options: ["I stand my ground and save every rupee.", "I buy exactly one cheap game I've always wanted.", "I buy a multiplayer game to play with friends.", "My wallet enters survival horror mode because of a 75% discount."], correctAnswer: 3, reaction: "YOU DIED. Cause of death: a 75% discount." }
];

// STATE VARIABLES
let currentQuestionIndex = 0;
let userAnswers = new Array(quizData.length).fill(null);
let isQuestionLocked = false; 
let itemsCollected = 0;
let isHacked = false; 

// DOM ELEMENTS
const introScreen = document.getElementById('intro-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const btnStart = document.getElementById('btn-start');
const btnConfirm = document.getElementById('btn-confirm');
const btnNext = document.getElementById('btn-next');
const btnRestart = document.getElementById('btn-restart');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const reactionBox = document.getElementById('reaction-box');
const reactionText = document.getElementById('reaction-text');
const currentQNum = document.getElementById('current-q-num');
const inventorySlots = document.querySelectorAll('.inv-slot');
const healthBox = document.getElementById('health-box');
const healthText = document.getElementById('health-text');
const bloodOverlay = document.getElementById('blood-overlay');
const graffitiEl = document.getElementById('graffiti-mark');

// FLASHLIGHT
const shadow = document.getElementById('flashlight');
function updateFlashlight(x, y) {
    const percentX = (x / window.innerWidth) * 100;
    const percentY = (y / window.innerHeight) * 100;
    shadow.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, transparent 15%, rgba(0,0,0,0.95) 85%)`;
}
document.addEventListener('mousemove', (e) => updateFlashlight(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => updateFlashlight(e.touches[0].clientX, e.touches[0].clientY));

// AUDIO
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type = 'click') {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'click') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'success') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(600, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'error') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(80, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    }
}
document.addEventListener('click', (e) => {
    if ((e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('.option-btn')) && !e.target.closest('.keypad-overlay') && e.target.id !== 'btn-confirm') {
        playSound('click');
    }
});

function playAlarm() {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'square'; osc.frequency.setValueAtTime(400, audioCtx.currentTime); osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.start(); osc.stop(audioCtx.currentTime + 0.5);
}

// DIALOGUE
const dialogueBox = document.getElementById('dialogue-box');
const dialogueText = document.getElementById('dialogue-text');
let isDialogueActive = false;
function showDialogue(text) {
    isDialogueActive = true;
    dialogueBox.classList.remove('hidden');
    dialogueText.textContent = text;
    playSound('click');
}
document.addEventListener('click', (e) => {
    if (isDialogueActive && !e.target.closest('.inv-slot') && !e.target.closest('.env-joke-btn') && !e.target.closest('.qte-mash-btn') && !e.target.closest('.keypad-overlay')) {
        dialogueBox.classList.add('hidden');
        isDialogueActive = false;
        playSound('click');
    }
});

// ==========================================
// QTE & KEYPAD LOCKOUT LOGIC
// ==========================================
const jokeTrigger = document.getElementById('joke-trigger');
const qteOverlay = document.getElementById('qte-overlay');
const qteUi = document.getElementById('qte-ui');
const qteSuccessScreen = document.getElementById('qte-success');
const qteTimeEl = document.getElementById('qte-time');
const qteMashBtn = document.getElementById('qte-mash-btn');
const qteProgress = document.getElementById('qte-progress-fill');
const deathScreen = document.getElementById('death-screen');

let qteActive = false;
let qteClicks = 0;
const clicksNeeded = 25; 
let qteTimerLeft = 3.0; // Panic timer 3 seconds
let qteInterval;
let alarmInterval;

// SOFT LOCK LOGIC
let qteAttempts = 0;
const MAX_ATTEMPTS = 2;

jokeTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isHacked || qteActive) return; 
    
    // If they failed twice, soft lock them and show keypad
    if (qteAttempts >= MAX_ATTEMPTS) {
        showKeypad();
        return;
    }
    startQTE();
});

function startQTE() {
    qteActive = true;
    qteClicks = 0;
    qteTimerLeft = 3.0;
    qteProgress.style.width = '0%';
    
    qteUi.classList.remove('hidden');
    qteSuccessScreen.classList.add('hidden');
    qteOverlay.classList.remove('hidden');
    
    alarmInterval = setInterval(playAlarm, 600);
    qteInterval = setInterval(() => {
        qteTimerLeft -= 0.1;
        qteTimeEl.textContent = Math.max(0, qteTimerLeft).toFixed(1);
        if (qteTimerLeft <= 0) {
            clearInterval(qteInterval);
            clearInterval(alarmInterval);
            qteFailed();
        }
    }, 100);
}

qteMashBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!qteActive) return;
    qteClicks++;
    
    qteOverlay.classList.remove('qte-shake');
    void qteOverlay.offsetWidth; 
    qteOverlay.classList.add('qte-shake');
    playSound('click'); 
    
    const progress = (qteClicks / clicksNeeded) * 100;
    qteProgress.style.width = `${progress}%`;

    if (qteClicks >= clicksNeeded) {
        clearInterval(qteInterval);
        clearInterval(alarmInterval);
        qteWon();
    }
});

function qteFailed() {
    qteActive = false;
    qteOverlay.classList.add('hidden');
    deathScreen.classList.remove('hidden');
    playSound('error'); 
    
    qteAttempts++; // Increment failures
    userAnswers.fill(-1); // Wipe score
    
    setTimeout(() => {
        deathScreen.classList.add('hidden');
        if (qteAttempts >= MAX_ATTEMPTS) {
            showDialogue("SYSTEM LOCKED DUE TO MULTIPLE FAILED OVERRIDES. ADMINISTRATOR PASSCODE REQUIRED.");
            jokeTrigger.style.color = 'var(--re-danger-red)'; // Visually show it's locked
        } else {
            showDialogue("SYSTEM PURGE COMPLETE. All previous assessment data has been erased.");
        }
    }, 4000);
}

function qteWon() {
    qteActive = false;
    isHacked = true; 
    playSound('success'); 
    qteUi.classList.add('hidden'); 
    qteOverlay.classList.remove('qte-shake'); 
    qteSuccessScreen.classList.remove('hidden');
    
    setTimeout(() => {
        qteOverlay.classList.add('hidden');
        
        if (itemsCollected < inventorySlots.length) {
            const div = document.createElement('div');
            div.className = 'item-keycard';
            div.addEventListener('click', (ev) => {
                ev.stopPropagation(); 
                showDialogue("Level 4 Security Keycard. The system is compromised. The answers are yours.");
            });
            inventorySlots[itemsCollected].appendChild(div);
            itemsCollected++;
        }
        renderQuestion();
        showDialogue("SECURITY BREACH. Administrator privileges granted. Assessment data exposed.");
    }, 2500); 
}

// ==========================================
// KEYPAD MINIGAME LOGIC
// ==========================================
const keypadOverlay = document.getElementById('keypad-overlay');
const keypadDisplay = document.getElementById('keypad-display');
const keypadBtns = document.querySelectorAll('.key-btn');
const keypadClose = document.getElementById('keypad-close');

let enteredCode = "";
const SECRET_CODE = "4681"; // Only you know this

function showKeypad() {
    enteredCode = "";
    updateKeypadDisplay();
    keypadDisplay.classList.remove('error');
    keypadOverlay.classList.remove('hidden');
    playSound('click');
}

keypadClose.addEventListener('click', () => {
    keypadOverlay.classList.add('hidden');
    playSound('click');
});

keypadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('click');
        const key = btn.textContent;

        if (key === 'CLR') {
            enteredCode = "";
            keypadDisplay.classList.remove('error');
        } else if (key === 'ENT') {
            if (enteredCode === SECRET_CODE) {
                // SUCCESS! Unlock system
                playSound('success');
                qteAttempts = 0; // Reset soft lock
                jokeTrigger.style.color = 'var(--text-main)'; // Restore trigger color
                keypadOverlay.classList.add('hidden');
                showDialogue("PASSCODE ACCEPTED. OVERRIDE TERMINAL UNLOCKED.");
            } else {
                // FAIL
                playSound('error');
                keypadDisplay.classList.add('error');
                keypadDisplay.textContent = "ERR";
                setTimeout(() => {
                    enteredCode = "";
                    updateKeypadDisplay();
                    keypadDisplay.classList.remove('error');
                }, 1000);
            }
        } else {
            // Typing numbers
            if (enteredCode.length < 4) {
                enteredCode += key;
            }
        }
        
        if (key !== 'ENT') updateKeypadDisplay();
    });
});

function updateKeypadDisplay() {
    if (enteredCode.length === 0) {
        keypadDisplay.textContent = "----";
    } else {
        // Pad the rest with dashes
        let displayStr = enteredCode;
        while (displayStr.length < 4) displayStr += "-";
        keypadDisplay.textContent = displayStr;
    }
}

// ==========================================
// CORE QUIZ LOGIC
// ==========================================
function addInventoryItem() {
    if (itemsCollected < inventorySlots.length) {
        const itemTypes = ['item-herb-green', 'item-ammo', 'item-herb-red'];
        const itemDescriptions = {
            'item-herb-green': "You inspect the Green Herb. It's literally just parsley. You've been scammed.",
            'item-ammo': "15 rounds of 9mm ammo. Great! Now you just need a gun. And aim.",
            'item-herb-red': "A Red Herb. You take a bite. It tastes like spicy regret."
        };
        const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const div = document.createElement('div');
        div.className = randomType;
        div.addEventListener('click', (e) => {
            e.stopPropagation(); showDialogue(itemDescriptions[randomType]);
        });
        inventorySlots[itemsCollected].appendChild(div);
        itemsCollected++;
    }
}

btnStart.addEventListener('click', () => {
    currentQuestionIndex = 0; userAnswers.fill(null); itemsCollected = 0; isHacked = false; qteAttempts = 0; jokeTrigger.style.color = 'var(--text-main)'; resetEnvironment(); switchScreen(quizScreen); renderQuestion();
});

btnConfirm.addEventListener('click', () => {
    isQuestionLocked = true; btnConfirm.classList.add('hidden'); document.querySelectorAll('.option-btn').forEach(btn => btn.classList.add('locked'));
    const isCorrect = userAnswers[currentQuestionIndex] === quizData[currentQuestionIndex].correctAnswer;
    if (isCorrect) { playSound('success'); addInventoryItem(); } else { playSound('error'); takeDamage(); }
    reactionBox.classList.remove('hidden'); btnNext.textContent = (currentQuestionIndex === quizData.length - 1) ? "View Final Log" : "Proceed"; reactionText.textContent = quizData[currentQuestionIndex].reaction;
});

btnNext.addEventListener('click', () => {
    if (currentQuestionIndex < quizData.length - 1) { currentQuestionIndex++; renderQuestion(); } else { showResults(); }
});

btnRestart.addEventListener('click', () => {
    currentQuestionIndex = 0; userAnswers.fill(null); itemsCollected = 0; isHacked = false; qteAttempts = 0; jokeTrigger.style.color = 'var(--text-main)'; resetEnvironment(); switchScreen(quizScreen); renderQuestion();
});

function switchScreen(screenToShow) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); screenToShow.classList.add('active'); }

function renderQuestion() {
    const data = quizData[currentQuestionIndex]; isQuestionLocked = false; currentQNum.textContent = currentQuestionIndex + 1; optionsContainer.innerHTML = ''; btnConfirm.classList.add('hidden'); btnConfirm.disabled = true; reactionBox.classList.add('hidden'); reactionText.textContent = '';
    
    if (Math.random() > 0.6) {
        const scratches = ["RUN", "LOCKED", "|||| ||", "IT HURTS"]; graffitiEl.textContent = scratches[Math.floor(Math.random() * scratches.length)]; graffitiEl.style.top = `${Math.floor(Math.random() * 80) + 10}%`; graffitiEl.style.right = `${Math.floor(Math.random() * 20) - 5}%`; graffitiEl.style.transform = `rotate(${Math.floor(Math.random() * 40) - 20}deg)`; graffitiEl.style.opacity = '1';
    } else { graffitiEl.style.opacity = '0'; }
    
    questionText.textContent = data.question;
    const letters = ['A', 'B', 'C', 'D'];
    data.options.forEach((option, index) => {
        const btn = document.createElement('button'); btn.className = 'option-btn';
        if (isHacked && index === data.correctAnswer) { btn.classList.add('hacked-correct'); }
        btn.innerHTML = `<span class="option-letter">${letters[index]}.</span> ${option}`;
        btn.addEventListener('click', () => {
            if (isQuestionLocked) return; document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); userAnswers[currentQuestionIndex] = index; btnConfirm.disabled = false; btnConfirm.classList.remove('hidden');
        });
        optionsContainer.appendChild(btn);
    });
}

function takeDamage() {
    bloodOverlay.style.opacity = '1'; setTimeout(() => { bloodOverlay.style.opacity = '0'; }, 400);
    let currentWrong = 0; quizData.forEach((q, i) => { if (userAnswers[i] !== null && userAnswers[i] !== q.correctAnswer) currentWrong++; });
    if (currentWrong === 2) { healthBox.className = 'status-box caution'; healthText.textContent = 'CAUTION'; } else if (currentWrong >= 4) { healthBox.className = 'status-box danger'; healthText.textContent = 'DANGER'; }
}

function resetEnvironment() { healthBox.className = 'status-box fine'; healthText.textContent = 'FINE'; inventorySlots.forEach(slot => slot.innerHTML = ''); graffitiEl.style.opacity = '0'; }

function showResults() {
    switchScreen(resultsScreen); graffitiEl.style.opacity = '0';
    let score = 0; quizData.forEach((q, index) => { if (userAnswers[index] === q.correctAnswer) score++; });
    document.getElementById('final-score').textContent = `${score}/7`;
    const titleEl = document.getElementById('rank-title'); const descEl = document.getElementById('rank-desc');
    if (score <= 2) { titleEl.textContent = "NEW ARRIVAL"; descEl.textContent = "Have we met, or have you been skipping every post?"; } else if (score <= 4) { titleEl.textContent = "SURVIVOR"; descEl.textContent = "You've picked up a few things. Not bad."; } else if (score <= 6) { titleEl.textContent = "ELITE AGENT"; descEl.textContent = "Okay, you've actually been paying attention."; } else { titleEl.textContent = "S-TIER RANK"; descEl.textContent = "You know the lore. Unfortunately, you're also part of the lore."; }
}