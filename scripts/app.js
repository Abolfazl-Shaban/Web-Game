import { RunnerObject } from "./Things.js";

const jumpBtn = document.getElementById("jumpBtn");
const downBtn = document.getElementById("downBtn");


const backdrop = document.querySelector("#backdrop");
const dead = document.querySelector("#dead");
const character = document.querySelector("#object");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const frame = document.querySelector(".moveFrame");
const blockFrame = document.querySelector("#blockFrame");
const scoreText = document.querySelector("#score");
const coinsText = document.querySelector("#coins");
const ScoreTitle = document.querySelector("#ScoreTitle");
const bestScoreText = document.querySelector("#Bscore");

document.querySelectorAll("#bestScoreTitle")[0].innerHTML =
  localStorage.getItem("bestScore") ?? 0;
document.querySelectorAll("#bestScoreTitle")[1].innerHTML =
  localStorage.getItem("bestScore") ?? 0;


export let gameStarted = false;

let jump = false;
let down = false;
let jumpC = false;

let jumpValue = 0.2;
export let speed = 2;

let Score = 0;
let Coin = 0;
let BestScore = localStorage.getItem("bestScore") ?? 0;
coinsText.innerHTML = localStorage.getItem("coins") ?? 0;
Coin = parseInt(localStorage.getItem("coins") ?? 0);

const BlockRunner = new RunnerObject("block", 3);
const CloudRunner = new RunnerObject("cloud", 1);
const CoinRunner = new RunnerObject("coin", 3);

startBtn.addEventListener("click", () => {
  startGame();
});
restartBtn.addEventListener("click", () => {
  restartGame();
});

let DefaultnumY = 8;
bestScoreText.innerHTML = localStorage.getItem("bestScore") ?? 0;

function startGame() {
  StartHandler();

  backdrop.classList.add("hidden");

  let numY = DefaultnumY;

  character.attributes.removeNamedItem("hidden");
  let tempY = DefaultnumY;
  setInterval(() => {

    if (!gameStarted) return;

    if (tempY < 0) jump = false;

    if (jump) {
      if (numY < frame.offsetHeight - character.offsetHeight - 10) {
        tempY -= jumpValue;
        numY += Math.max(tempY, 0);
      }
    } else {
      if (numY > 0) {
        tempY += jumpValue;
        numY -= tempY;
      } else {
        tempY = DefaultnumY;
        numY = 0;
        jumpC = false;
      }
    }

    if (down) {
      if (numY > DefaultnumY) {
        numY -= 8;
      } else {
        jumpC = false;
        jump = false;
        down = false;
      }
    }

    character.style.left = `100px`;
    character.style.bottom = `${numY}px`;
  }, 20);
}

function restartGame() {
  Score = 0;
  blockFrame.innerHTML = "";
  speed = 2;
  dead.classList.add("hidden");

  character.classList.add("animate-spin");

  gameStarted = true;
  character.style.bottom = 0;
  StartHandler();
}

function scoreHandler() {
  setInterval(() => {
    if (!gameStarted) return;
    Score += speed;
    ScoreTitle.innerHTML = Math.round(Score);
    scoreText.innerHTML = Math.round(Score);

    document.querySelectorAll("#bestScoreTitle")[0].innerHTML = BestScore;
    document.querySelectorAll("#bestScoreTitle")[1].innerHTML = BestScore;

    if (Score > BestScore) {
      BestScore = Math.round(Score);
      bestScoreText.innerHTML = Math.round(Score);
    }
  }, 100);

  setInterval(() => {
    if (gameStarted) speed += 0.05;
  }, 2000);
}

function StartHandler() {
  gameStarted = true;
  RunBlocks();
  RunClouds();
  RunCoins();
  scoreHandler();
}
function StopHandler() {
  gameStarted = false;
  jump = false;
  jumpC = false;
  localStorage.setItem("bestScore", Math.round(BestScore));
  localStorage.setItem("coins", Coin);
  dead.classList.remove("hidden");

  character.classList.remove("animate-spin");
}

function RunBlocks() {
  BlockRunner.run();

  BlockRunner.action = () => {
    StopHandler();
  };

  let num = 0;
  loop();

  function loop() {
    setTimeout(() => {
      if (gameStarted) {
        BlockRunner.createData.height = Math.random() * 50 + 10;
        BlockRunner.createData.classes = `bg-red-500 bottom-0`;
        BlockRunner.create();

        num = Math.random() * 7000;
        loop();
      }
    }, num + 1000);
  }
}

function RunClouds() {
  CloudRunner.run();
  let num = 0;
  loop();

  function loop() {
    setTimeout(() => {
      if (gameStarted) {
        CloudRunner.createData.src = "cloud.png";
        CloudRunner.createData.classes = `top-[${
          Math.random() * 50 + 10
        }px] scale-[${Math.random() * 2 + 1}] opacity-[${Math.random()}]`;
        CloudRunner.create();

        num = Math.random() * 4000;
        loop();
      }
    }, num + 1000);
  }
}

function RunCoins() {
  CoinRunner.run();
  let num = 0;
  loop();

  function loop() {
    setTimeout(() => {
      if (gameStarted) {
        CoinRunner.createData.src = "coin.png";
        CoinRunner.createData.classes = `scale-[2] transition-all`;
        CoinRunner.createData.style = `bottom: ${
          Math.random() > 0.3 ? "5" : "50"
        }px;transition-property: transform,opacity; transition-duration: 400ms;`;
        CoinRunner.create();

        CoinRunner.action = (item) => {
          item.classList.add("-translate-y-36", "opacity-0");
          Coin++;

          coinsText.innerHTML = Coin;
        };

        num = Math.random() * 7000;
        loop();
      }
    }, num + 2000);
  }
}

window.addEventListener("keydown", (e) => {
  if (e.key == "ArrowUp" && !jumpC) {
    jump = true;
    jumpC = true;
  }
});
window.addEventListener("keydown", (e) => {
  if (e.key == "ArrowDown") {
    down = true;
  }
});

jumpBtn.addEventListener("click", () => {
  if(!jumpC){
    jump = true;
    jumpC = true;
  }
    
});

downBtn.addEventListener("click", () => {
    down = true;
  
});
