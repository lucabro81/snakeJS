import { ARENA_HEIGHT, ARENA_WIDTH, FOOD, SNAKE_BODY } from "./const.js";
import { getRandomInt } from "./utils.js";

let arenaElement = null;
let scoreElement = null;
let gameoverElement = null;
let loopTimer = 0;
let stopped = false;

function createArenaNode() {
  return {
    data: " ",
    prev: null,
    next: null,
    upper: null,
    lower: null,
    isFood() {
      return this.data === FOOD;
    },
    isSnake() {
      return this.data === SNAKE_BODY;
    },
    connectVerticallyWith(node) {
      this.upper = node;
      node.lower = this;
    },
    connectHorizontallyWith(node) {
      this.next = node;
      node.prev = this;
    },
    writeAtPosition(position, data) {
      let currNode = this;
      const rowElement = currNode.row().goToPosition(position[0]);
      const columnElement = currNode
        .column(rowElement)
        .goToPosition(position[1]);
      columnElement.data = data;
      return columnElement;
    },
    column(startNode) {
      const that = this;
      return {
        goToTheEnd() {
          let currNode = that;
          while (currNode.lower) {
            currNode = currNode.lower;
          }
          return currNode;
        },
        goToPosition(position) {
          let currNode = that;
          if (startNode) {
            currNode = startNode;
          }
          let i = 0;
          while (i < position) {
            currNode = currNode.lower;
            i++;
          }
          return currNode;
        },
      };
    },
    row(startNode) {
      const that = this;
      return {
        goToPosition(position) {
          let currNode = that;
          if (startNode) {
            currNode = startNode;
          }
          let i = 0;
          while (i < position) {
            currNode = currNode.next;
            i++;
          }
          return currNode;
        },
      };
    },
  };
}

export function setAssets(assets) {
  arenaElement = assets.arenaElement;
  scoreElement = assets.scoreElement;
  gameoverElement = assets.gameoverElement;
}

export function randomPosition() {
  return [getRandomInt(0, ARENA_WIDTH), getRandomInt(0, ARENA_HEIGHT)];
}

const arenaMatrix = createArenaNode();
const snake = {
  head: null,
  tail: null,
  segments: 0,
  bufferDirections: [],
  scoreNumber: 0,
  currDirection: null,
  lastDirection: null,
  newHead(headNode) {
    this.bufferDirections.push(this.currDirection);
    // this.head.data = this.tail.data;
    this.head = headNode;
    this.head.data = SNAKE_BODY;
  },
  newTail() {
    this.tail.data = " ";
    this.tail = this.tail[TAIL_DIRECTION[this.bufferDirections.shift()]];
    this.tail.data = SNAKE_BODY;
  },
};
const directions = {
  ArrowUp: {
    direction: () => directionManagement(snake.head.upper),
    opposite: ["ArrowDown", "KeyS"],
  },
  KeyW: {
    direction: () => directionManagement(snake.head.upper),
    opposite: ["ArrowDown", "KeyS"],
  },
  ArrowDown: {
    direction: () => directionManagement(snake.head.lower),
    opposite: ["ArrowUp", "KeyW"],
  },
  KeyS: {
    direction: () => directionManagement(snake.head.lower),
    opposite: ["ArrowUp", "KeyW"],
  },
  ArrowLeft: {
    direction: () => directionManagement(snake.head.prev),
    opposite: ["ArrowRight", "KeyD"],
  },
  KeyA: {
    direction: () => directionManagement(snake.head.prev),
    opposite: ["ArrowRight", "KeyD"],
  },
  ArrowRight: {
    direction: () => directionManagement(snake.head.next),
    opposite: ["ArrowLeft", "KeyA"],
  },
  KeyD: {
    direction: () => directionManagement(snake.head.next),
    opposite: ["ArrowLeft", "KeyA"],
  },
};

function initArenaMatrix() {
  let startNode = arenaMatrix;
  let finishNode = arenaMatrix;
  let lastUpperNode = null;

  for (let i = 0; i < ARENA_HEIGHT; i++) {
    if (i > 0) {
      // init first row element
      const firstRowNode = createArenaNode();
      firstRowNode.connectVerticallyWith(startNode);

      // set start and finish pointer to this element
      startNode = firstRowNode;
      finishNode = startNode;

      // link to the last first row element
      lastUpperNode = startNode.upper.next;
    }

    // for the rest of the element in the row
    for (let j = 1; j < ARENA_WIDTH; j++) {
      // create a new element
      const currNode = createArenaNode();
      finishNode.connectHorizontallyWith(currNode);

      // link to the actual finish element of the row
      finishNode = finishNode.next;

      // check if exist an element above or below the new one
      if (i > 0 && lastUpperNode !== null) {
        // if yes, link to them
        finishNode.connectVerticallyWith(lastUpperNode);
        lastUpperNode = lastUpperNode.next;
      }
    }

    // link every row head-tail
    finishNode.connectHorizontallyWith(startNode);
  }

  // link every column head-tail
  let start = arenaMatrix;
  let finish = arenaMatrix;

  let j = 0;

  while (j < ARENA_WIDTH) {
    // go til the end af the column
    finish = finish.column().goToTheEnd();

    // link the end of the column with the head
    start.connectVerticallyWith(finish);

    // move to the next column
    start = start.next;
    finish = start;

    j++;
  }
}

function initialPosition() {
  const startPosition = randomPosition();
  // console.log("startPosition", startPosition, arenaMatrix);
  const curr = arenaMatrix.writeAtPosition(startPosition, SNAKE_BODY);

  // let curr = arenaMatrix;

  // let i = 0;
  // let j = 0;

  // while (j < startPosition[0]) {
  //   curr = curr.next;
  //   j++;
  // }

  // while (i < startPosition[1]) {
  //   curr = curr.lower;
  //   i++;
  // }

  curr.data = "*";
  snake.head = curr;
  snake.tail = curr;
  return arenaMatrix;
}

function spawnFood() {
  const foodPosition = randomPosition();
  // console.log("foodPosition", foodPosition, arenaMatrix.prev);
  arenaMatrix.writeAtPosition(foodPosition, FOOD);
  // let food = arenaMatrix;
  // console.log("foodPosition", foodPosition);

  // let i = 0;
  // let j = 0;

  // while (j < foodPosition[0]) {
  //   food.data = "g";
  //   food = food.next;
  //   j++;
  // }

  // while (i < foodPosition[1]) {
  //   food.data = "g";
  //   food = food.lower;
  //   i++;
  // }

  // food.data = FOOD;
  // snake.segments++;
  // segments++;
  snake.segments++;
  return arenaMatrix;
}

function directionManagement(headFutureNode) {
  snake.newHead(headFutureNode);

  if (headFutureNode.isSnake()) {
    stopped = true;
    gameoverElement.style.display = "block"; // TODO: dispatch event
    return;
  }

  if (!headFutureNode.isFood()) {
    snake.newTail();
    snake.scoreNumber += 1;
  } else {
    shift = false;
    snake.scoreNumber += 10;
    spawnFood();
  }
}

function draw() {
  directions[snake.currDirection] &&
    directions[snake.currDirection].direction();

  let text = "";

  let start = arenaMatrix;
  let finish = arenaMatrix;

  let i = 0;
  let j = 0;

  while (i < ARENA_HEIGHT) {
    while (j < ARENA_WIDTH) {
      text += finish.data;
      finish = finish.next;
      j++;
    }
    text += `\n`;
    start = start.lower;
    finish = start;
    j = 0;
    i++;
  }

  arenaElement.innerText = text;
  scoreElement.innerText = snake.scoreNumber.toString();
}

function isValidDirection(selectedDir) {
  const lastDir = snake.lastDirection;
  return (
    selectedDir !== lastDir &&
    !directions[selectedDir].opposite.includes(lastDir)
  );
}

function onKeyUp(evt) {
  if (isValidDirection(evt.code)) {
    snake.currDirection = evt.code;
    clearInterval(loopTimer);
    draw();
    mainLoop();
    snake.lastDirection = snake.currDirection;
  }
}

function initKeyboardEvents() {
  document.addEventListener("keyup", onKeyUp);
}

function mainLoop() {
  loopTimer = setInterval(() => {
    if (stopped) {
      document.removeEventListener("keyup", onKeyUp);
      clearInterval(loopTimer);
      return;
    }
    draw();
  }, 200);
}

export function run() {
  initArenaMatrix();
  initialPosition();
  spawnFood();
  initKeyboardEvents();
  mainLoop();
}
