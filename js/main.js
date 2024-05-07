let count = 0;
let gameLevel = 1;
let randomDirections = [];
let progressBarValue = 50;
let gameIsStarted = false;
let isGameOver = false;
const elModal = document.querySelector(".js-modal");
const elBoardsWrapper = document.querySelector(".boards");
const elTopScore = document.querySelector(".js-top-score");
const elKarateMan = document.querySelector(".js-karate-man");
const elCurrentScore = document.querySelector(".js-current-score");
const elKarateManKick = document.querySelector(".js-karate-man-kick");
const elModalGameScore = document.querySelector(".js-modal-game-score");
const elModalPlayButton = document.querySelector(".js-modal-play-button");
const elProgressBarItem = document.querySelector(".js-progress-bar-item");

// audio
const clickAudio = document.createElement("audio");
const lostAudio = document.createElement("audio");
clickAudio.setAttribute("src", "./assets/audio/click.mp3");
lostAudio.setAttribute("src", "./assets/audio/fail.mp3");

// get random direction
const getRandomDirection = () => {
  const randomNumber = Math.floor(Math.random() * 5);

  if (randomNumber === 0 || randomNumber === 2) {
    return "left";
  } else if (randomNumber === 1 || randomNumber === 3) {
    return "right";
  } else {
    return "none";
  }
};

// get random board size
const getRandomBoardSize = () => {
  const randomNumber = Math.floor(Math.random() * 5);

  if (randomNumber === 0) {
    return "xs";
  } else if (randomNumber === 1) {
    return "sm";
  } else if (randomNumber === 2) {
    return "md";
  } else {
    return "lg";
  }
};

// set initial random directions
for (let i = 0; i < 6; i++) {
  const direction = getRandomDirection();
  const boardSize = getRandomBoardSize();

  const setRandomDirections = (value, size) => {
    randomDirections.push({
      id: i,
      value: value,
      boardSize: size,
    });

    // create boards
    const board = document.createElement("div");
    board.classList.add("board", value, size);
    elBoardsWrapper.prepend(board);
  };

  if (randomDirections.length > 0) {
    if (randomDirections[randomDirections.length - 1].value === "none") {
      setRandomDirections(direction, boardSize);
    } else {
      setRandomDirections("none", boardSize);
    }
  } else {
    setRandomDirections("none", boardSize);
  }
}

// get top score to local storage
const topScore = localStorage.getItem("top-score");
if (topScore) {
  elTopScore.textContent = `Eng yaxshi natija: ${topScore} 🔥`;
} else {
  elTopScore.textContent = "Eng yaxshi natija: 0 🔥";
}

// game over
const gameOver = () => {
  isGameOver = true;
  lostAudio.play();

  // set top score to local storage
  if (topScore) {
    if (count > Number(topScore)) {
      localStorage.setItem("top-score", count);
      elTopScore.textContent = `Eng yaxshi natija: ${count} 🔥`;
    }
  } else {
    localStorage.setItem("top-score", count);
  }

  // open modal
  elModal.classList.remove("hidden");
  elModalGameScore.textContent = count;
  elModalPlayButton.focus();
  elModalPlayButton.addEventListener("click", () => {
    window.location.reload();
  });
};

// set time and level with countdown
const setTimeAndLevel = () => {
  if (count > 40 && count < 80) {
    gameLevel = 1.5;
  } else if (count > 80 && count < 120) {
    gameLevel = 2;
  } else if (count > 160 && count < 200) {
    gameLevel = 3.5;
  } else if (count > 200 && count < 250) {
    gameLevel = 4;
  } else if (count > 250 && count < 300) {
    gameLevel = 4.5;
  }

  // progress bar
  elProgressBarItem.style.width = `${progressBarValue}%`;
  if (progressBarValue >= 0) {
    progressBarValue = progressBarValue - 1;
  } else {
    gameOver();
  }

  // set progress bar background color
  if (progressBarValue > 0 && progressBarValue < 33) {
    elProgressBarItem.style.background = "red";
  } else if (progressBarValue > 33 && progressBarValue < 66) {
    elProgressBarItem.style.background = "orange";
  } else if (progressBarValue > 66) {
    elProgressBarItem.style.background = "green";
  }

  setTimeout(() => {
    if (!isGameOver) {
      setTimeAndLevel();
    }
  }, Math.floor(300 / gameLevel));
};

// choose direction
const chooseDirection = (direction) => {
  if (!gameIsStarted) {
    gameIsStarted = true;
    setTimeAndLevel();
  }

  if (progressBarValue < 100) {
    progressBarValue++;
  }

  const prevDirection = randomDirections[count].value;
  const nextDirection = randomDirections[count + 1].value;

  // game continues
  if (direction === prevDirection || direction === nextDirection) {
    gameOver();
  } else {
    elCurrentScore.textContent = `🔥 Ball:  ${count + 1}`;
  }

  // random direction
  const randomDirection = getRandomDirection();
  const boardSize = getRandomBoardSize();

  // add new board
  if (randomDirections[randomDirections.length - 1].value === "none") {
    randomDirections.push({
      id: randomDirections,
      value: randomDirection,
      boardSize: boardSize,
    });

    // add new element
    const board = document.createElement("div");
    board.classList.add("board", randomDirection, boardSize);
    elBoardsWrapper.prepend(board);
  } else {
    randomDirections.push({
      id: randomDirections.length,
      value: "none",
      boardSize: boardSize,
    });

    // add new element
    const board = document.createElement("div");
    board.classList.add("board", "none", boardSize);
    elBoardsWrapper.prepend(board);
  }

  // remove last child
  const elBoards = elBoardsWrapper.querySelectorAll(".board");
  elBoards[elBoards.length - 1].remove();
  count++;
};

// change karate man actions (change image)
const changeKarateManActions = () => {
  elKarateMan.classList.add("hidden");
  elKarateManKick.classList.remove("hidden");

  setTimeout(() => {
    elKarateManKick.classList.add("hidden");
    elKarateMan.classList.remove("hidden");
  }, 100);
};

// play click audio
const playClickAudio = () => {
  clickAudio.currentTime = 0;
  clickAudio.play();
};

// choose direction
document.addEventListener("keydown", (event) => {
  if (!isGameOver) {
    if (event.key === "ArrowLeft") {
      playClickAudio();
      chooseDirection("left");
      changeKarateManActions();
      elKarateMan.classList.remove("right");
      elKarateManKick.classList.remove("right");
    } else if (event.key === "ArrowRight") {
      playClickAudio();
      chooseDirection("right");
      changeKarateManActions();
      elKarateMan.classList.add("right");
      elKarateManKick.classList.add("right");
    }
  }
});
