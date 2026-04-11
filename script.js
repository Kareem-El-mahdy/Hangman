let aler = document.querySelector(".alert");
let score = document.querySelector(".score");
let gameScore = 0;
let play = document.querySelector(".play");
let timer = document.querySelector(".timer");
let fullBody = [
  document.querySelector(".one"),
  document.querySelector(".head"),
  document.querySelector(".body"),
  document.querySelector(".oneHand"),
  document.querySelector(".twoHands"),
  document.querySelector(".oneLeg"),
  document.querySelector(".fullBody"),
];
let hint = document.querySelector(".hint");
let inputSection = document.querySelector(".inputSection");
let wordEl = document.querySelector(".wordPlay");
let word = [];
let countLose = 0;
let original = "";
let findword = "";
let totalscore = 0
let time = 60
let interval;




let keyboard = document.querySelector(".keyboard");


const letters = "abcdefghijklmnopqrstuvwxyz".split("");

letters.forEach(letter => {
    let btn = document.createElement("div");
    btn.classList.add("key");
    btn.innerText = letter;

    btn.addEventListener("click", () => {
        handleGuess(letter);
    });

    keyboard.appendChild(btn);
});


function handleGuess(letter) {
    let countWin = false;

    for (let i = 0; i < original.length; i++) {
        if (original[i] === letter && word[i] === "_") {
            word[i] = letter;
            gameScore++;
            countWin = true;
        }
    }

    if (!countWin) {
        wrongAnswer();
    }

    wordEl.innerHTML = word.join(" ");

    if (!word.includes("_")) {
        gameSuccess();
    }
}











function gameSuccess()  {
    aler.style.display = "block"
    aler.innerHTML = `<div class="alert alert-success" role="alert">
    ${findword.alert}
</div>`
    if(findword.links.length>1){
        aler.innerHTML += `<a href="${findword.links}" target="_blank" class="btn btn-sm btn-dark alert-success">
        Open 🔗
      </a>` 
    }
        keyboard.style.display = "none"

    inputSection.style.display = "none";
    play.style.display = "block";
    play.innerHTML = "Play Again";
    gameScore = 0
    totalscore ++
}

function wrongAnswer() {
  if (countLose > 0) {
    fullBody[countLose - 1].style.display = "none";
  }

  if (countLose < fullBody.length) {
    fullBody[countLose].style.display = "block";
    countLose++;
  }

  if (countLose >= fullBody.length) {
    play.style.display = "block";
    play.innerHTML = "Play Again";
    inputSection.style.display = "none";
    gameScore = 0;
        keyboard.style.display = "none"

    aler.style.display = "block"
  aler.innerHTML = `<div class="alert alert-danger" role="alert">
  حاول تعرف عني اكتر 
</div>`
  }
  
}

function resetBody() {
  fullBody.forEach((el) => {
    if (el) el.style.display = "none";
  });
  countLose = 0;
}

play.addEventListener("click", () => {
    keyboard.style.display = "flex"
    clearInterval(interval)
    resetBody();

interval = setInterval(() => {
    time--;

    timer.innerHTML = `${time}`;

    if (time <= 0) {
        clearInterval(interval);
        time =120
        countLose = 7
        if (totalscore>6) {
            gameSuccess()
        }
        else{
        wrongAnswer()
    }}
}, 1000)
 
timer.style.display = "block";
   



  countLose = 0;
  score.innerHTML = gameScore;
  inputSection.style.display = "block";

  play.style.display = "none";
  fetch("/images/data.json")
    .then((Res) => Res.json())
    .then((data) => {
      findword = data[Math.floor(Math.random() * data.length)];
      hint.innerHTML = findword.hint;
      original = findword.word.toLowerCase();

      word = Array(original.length).fill("_");
      wordEl.innerHTML = word.join(" ");
    });
});
inputSection.addEventListener("keydown", (k) => {
  handleGuess(k.key.toLowerCase());
  let letter = k.key.toLowerCase();
  let countWin = false;

  for (let i = 0; i < original.length; i++) {
    if (original[i] === letter && word[i] === "_") {
      word[i] = letter;
      gameScore++;
      countWin = true;
    }
  }

  if (gameScore === original.length) {
    gameSuccess()
    

    
  }
  if (!countWin) {
    wrongAnswer();
  }
  wordEl.innerHTML = word.join(" ");
  score.innerHTML = totalscore;
});
