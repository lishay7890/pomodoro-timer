/* =========================
   TIMER SETTINGS
========================= */

let workTime = 25;
let shortBreakTime = 5;
let longBreakTime = 15;


/* =========================
   TIMER STATE
========================= */

let currentSession = "work";

let timeLeft = workTime * 60;

let timerInterval = null;

let isRunning = false;

let completedSessions = 0;


/* =========================
   DOM ELEMENTS
========================= */

const timerDisplay = document.getElementById("timer");

const sessionType = document.getElementById("sessionType");

const sessionCount = document.getElementById("sessionCount");

const startBtn = document.getElementById("startBtn");

const pauseBtn = document.getElementById("pauseBtn");

const resetBtn = document.getElementById("resetBtn");

const workBtn = document.getElementById("workBtn");

const shortBreakBtn =
    document.getElementById("shortBreakBtn");

const longBreakBtn =
    document.getElementById("longBreakBtn");

const workTimeInput =
    document.getElementById("workTime");

const shortBreakTimeInput =
    document.getElementById("shortBreakTime");

const longBreakTimeInput =
    document.getElementById("longBreakTime");

const saveSettingsBtn =
    document.getElementById("saveSettingsBtn");


/* =========================
   UPDATE TIMER DISPLAY
========================= */

function updateDisplay() {

    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


/* =========================
   UPDATE SESSION UI
========================= */

function updateSessionUI() {

    workBtn.classList.remove("active");

    shortBreakBtn.classList.remove("active");

    longBreakBtn.classList.remove("active");


    if (currentSession === "work") {

        sessionType.textContent = "Work";

        workBtn.classList.add("active");

    }

    else if (currentSession === "shortBreak") {

        sessionType.textContent = "Short Break";

        shortBreakBtn.classList.add("active");

    }

    else {

        sessionType.textContent = "Long Break";

        longBreakBtn.classList.add("active");

    }
}


/* =========================
   START TIMER
========================= */

function startTimer() {

    if (isRunning) {
        return;
    }

    isRunning = true;

    startBtn.disabled = true;

    pauseBtn.disabled = false;


    timerInterval = setInterval(() => {

        timeLeft--;

        updateDisplay();


        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            isRunning = false;

            playSound();

            switchSession();

        }

    }, 1000);
}


/* =========================
   PAUSE TIMER
========================= */

function pauseTimer() {

    if (!isRunning) {
        return;
    }

    clearInterval(timerInterval);

    isRunning = false;

    startBtn.disabled = false;

    pauseBtn.disabled = true;
}


/* =========================
   RESET TIMER
========================= */

function resetTimer() {

    clearInterval(timerInterval);

    isRunning = false;

    startBtn.disabled = false;

    pauseBtn.disabled = true;


    if (currentSession === "work") {

        timeLeft = workTime * 60;

    }

    else if (currentSession === "shortBreak") {

        timeLeft = shortBreakTime * 60;

    }

    else {

        timeLeft = longBreakTime * 60;

    }


    updateDisplay();
}


/* =========================
   SWITCH SESSION
========================= */

function switchSession() {

    if (currentSession === "work") {

        completedSessions++;

        sessionCount.textContent =
            completedSessions;


        if (completedSessions % 4 === 0) {

            currentSession = "longBreak";

            timeLeft = longBreakTime * 60;

        }

        else {

            currentSession = "shortBreak";

            timeLeft = shortBreakTime * 60;

        }

    }

    else {

        currentSession = "work";

        timeLeft = workTime * 60;

    }


    updateSessionUI();

    updateDisplay();

    startBtn.disabled = false;

    pauseBtn.disabled = true;
}


/* =========================
   SOUND
========================= */

function playSound() {

    const audioContext =
        new (window.AudioContext ||
        window.webkitAudioContext)();

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    oscillator.frequency.value = 800;

    oscillator.type = "sine";


    gain.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 1
    );


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 1
    );
}


/* =========================
   SELECT WORK
========================= */

workBtn.addEventListener("click", () => {

    clearInterval(timerInterval);

    isRunning = false;

    currentSession = "work";

    timeLeft = workTime * 60;

    updateSessionUI();

    updateDisplay();

    startBtn.disabled = false;

    pauseBtn.disabled = true;
});


/* =========================
   SELECT SHORT BREAK
========================= */

shortBreakBtn.addEventListener("click", () => {

    clearInterval(timerInterval);

    isRunning = false;

    currentSession = "shortBreak";

    timeLeft = shortBreakTime * 60;

    updateSessionUI();

    updateDisplay();

    startBtn.disabled = false;

    pauseBtn.disabled = true;
});


/* =========================
   SELECT LONG BREAK
========================= */

longBreakBtn.addEventListener("click", () => {

    clearInterval(timerInterval);

    isRunning = false;

    currentSession = "longBreak";

    timeLeft = longBreakTime * 60;

    updateSessionUI();

    updateDisplay();

    startBtn.disabled = false;

    pauseBtn.disabled = true;
});


/* =========================
   SAVE SETTINGS
========================= */

saveSettingsBtn.addEventListener("click", () => {

    const newWorkTime =
        Number(workTimeInput.value);

    const newShortBreakTime =
        Number(shortBreakTimeInput.value);

    const newLongBreakTime =
        Number(longBreakTimeInput.value);


    if (
        newWorkTime < 1 ||
        newShortBreakTime < 1 ||
        newLongBreakTime < 1
    ) {

        alert("Please enter valid times.");

        return;
    }


    workTime = newWorkTime;

    shortBreakTime = newShortBreakTime;

    longBreakTime = newLongBreakTime;


    resetTimer();

    alert("Settings saved!");
});


/* =========================
   BUTTON EVENTS
========================= */

startBtn.addEventListener(
    "click",
    startTimer
);

pauseBtn.addEventListener(
    "click",
    pauseTimer
);

resetBtn.addEventListener(
    "click",
    resetTimer
);


/* =========================
   INITIALIZE
========================= */

updateSessionUI();

updateDisplay();