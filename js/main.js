const elBoardsWrapper = document.querySelector(".boards");
const elCurrentScore = document.querySelector(".js-current-score");
const elTopScore = document.querySelector(".js-top-score");
const elKarateMan = document.querySelector(".karate-man");
let randomDirections = [];
let count = 0;

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
  elTopScore.textContent = `Eng yaxshi natija: ${topScore}`;
} else {
  elTopScore.textContent = "Eng yaxshi natija: 0";
}

// choose direction
const chooseDirection = (direction) => {
  const prevDirection = randomDirections[count].value;
  const nextDirection = randomDirections[count + 1].value;

  // game continues
  if (direction === prevDirection || direction === nextDirection) {
    // set top score to local storage
    if (topScore) {
      if (count > Number(topScore)) {
        localStorage.setItem("top-score", count);
        elTopScore.textContent = `Eng yaxshi natija: ${count}`;
      }
    } else {
      localStorage.setItem("top-score", count);
    }

    // alert
    alert("Game over!");
  } else {
    elCurrentScore.textContent = `Ball:  ${count + 1}`;
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

  // if (randomDirections[count - 1]) {
  // randomDirections = randomDirections.filter(
  //   (board) => board.id !== randomDirections[count - 1].id
  // );
  // }

  count++;
};

// choose direction
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    elKarateMan.classList.remove("right");
    chooseDirection("left");
  } else if (event.key === "ArrowRight") {
    elKarateMan.classList.add("right");
    chooseDirection("right");
  }
});
