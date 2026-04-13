let aler = document.querySelector(".alert");
let scoreEl = document.querySelector(".score");
let playBtn = document.querySelector(".play");
let card = document.querySelector(".scorebar");
let cardtext = document.querySelector(".textscore");
let timerEl = document.querySelector(".timer");
let wordEl = document.querySelector(".wordPlay");
let hintEl = document.querySelector(".hint");
let keyboard = document.querySelector(".keyboard");
let inputSection = document.querySelector(".inputSection");

let fullBody = [
    document.querySelector(".one"),
    document.querySelector(".head"),
    document.querySelector(".body"),
    document.querySelector(".oneHand"),
    document.querySelector(".twoHands"),
    document.querySelector(".oneLeg"),
    document.querySelector(".fullBody"),
];

// حالة اللعبة (Game State)
let word = [];
let original = "";
let findword = null;
let countLose = 0;
let totalscore = 0;
let time = 20;
let interval;

// إنشاء لوحة المفاتيح
const letters = "1234567890qwertyuiopasdfghjklzxcvbnm".split("");
letters.forEach(letter => {
    let btn = document.createElement("div");
    btn.classList.add("key");
    btn.innerText = letter;
    btn.addEventListener("click", () => handleGuess(letter));
    keyboard.appendChild(btn);
});

function handleGuess(letter) {
    // التوقف إذا خسر اللاعب أو اكتملت الكلمة
    if (countLose >= fullBody.length || !word.includes("_")) return; 

    let isCorrect = false;
    for (let i = 0; i < original.length; i++) {
        if (original[i] === letter && word[i] === "_") {
            word[i] = letter;
            isCorrect = true;
        }
    }

    if (!isCorrect) {
        wrongAnswer();
    } else {
        wordEl.innerHTML = word.join(" ");
        if (!word.includes("_")) gameSuccess();
    }
}

function gameSuccess() {
    clearInterval(interval);
    totalscore++;
    cardtext.innerHTML = totalscore;
    scoreEl.innerHTML = totalscore;

    aler.style.display = "block";
    aler.innerHTML = `<div class="alert alert-success">${findword.alert}</div>`;
    
    if (findword.links && findword.links.length > 1) {
        aler.innerHTML += `<a href="${findword.links}" target="_blank" class="btn btn-sm btn-dark">افتح الرابط 🔗</a>`;
    }

    keyboard.style.display = "none";
    playBtn.style.display = "block";
    playBtn.innerHTML = "العب مرة أخرى";
}

function wrongAnswer() {
    if (countLose < fullBody.length) {
        fullBody[countLose].style.display = "block";
        countLose++;
    }

    if (countLose >= fullBody.length) {
        endGame(false);
    }
}

function endGame(isTimeout = false) {
    clearInterval(interval);
    keyboard.style.display = "none";
    playBtn.style.display = "block";
    inputSection.style.display = "none";
    
    aler.style.display = "block";
    aler.innerHTML = `<div class="alert alert-danger">${isTimeout ? "انتهى الوقت!" : "حاول تعرف عني اكتر"}</div>`;
    
    document.querySelector(".card").style.display = "none";
    card.style.display = "block";
}

function resetUI() {
    fullBody.forEach(el => { if(el) el.style.display = "none"; });
    aler.style.display = "none";
    keyboard.style.display = "flex";
    playBtn.style.display = "none";
    inputSection.style.display = "block";
    countLose = 0;
    time = 20; // إعادة ضبط الوقت
    timerEl.innerHTML = time;
}

function startNewGame() {
    resetUI();
    clearInterval(interval);

    // جلب البيانات من الملف
    fetch("/images/data.json")
        .then(res => res.json())
        .then(data => {
            findword = data[Math.floor(Math.random() * data.length)];
            original = findword.word.toLowerCase();
            word = Array(original.length).fill("_");
            wordEl.innerHTML = word.join(" ");
            hintEl.innerHTML = findword.hint;

            // بدء العد التنازلي
            interval = setInterval(() => {
                time--;
                timerEl.innerHTML = time;
                if (time <= 0) {
                    if (totalscore > 6) gameSuccess(); 
                    else endGame(true);
                }
            }, 1000);
        })
        .catch(err => console.error("خطأ في تحميل الكلمات:", err));
}

// مستمعي الأحداث (Event Listeners)
playBtn.addEventListener("click", startNewGame);
card.addEventListener("click", startNewGame);

window.addEventListener("keydown", (e) => {
    if (letters.includes(e.key.toLowerCase())) {
        handleGuess(e.key.toLowerCase());
    }
});

document.querySelector(".scorebtn").addEventListener("click", () => {
    card.style.display = "block";
    document.querySelector(".card").style.display = "none";
});