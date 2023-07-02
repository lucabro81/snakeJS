const ARENA_WIDTH = 50;
const ARENA_HEIGHT = 30;
const FOOD = 'F';
const SNAKE = '*';

// TODO: cais
// test comment

const absWrapper = document.createElement('div');
absWrapper.style = {
	position: "absolute",
	width: "100%",
	height: "100%",
	background: "#ffffff"
};

const container = absWrapper.appendChild(document.createElement('div'));
container.style = {
	border: "1px #000 solid",
	width: "fit-content",
	position: "absolute",
	transform: "translate(50%, 50%)"
}

const pre = container.appendChild(document.createElement('pre'));
pre.style.borderBottom = '1px #000 solid';
pre.style.width = 'fit-content';

const scoreParagraph = container.appendChild(document.createElement('p'));
scoreParagraph.innerText = 'Score: ';

const score = scoreParagraph.appendChild(document.createElement('span'));

const gameover = container.appendChild(document.createElement('div'));
gameover.innerText = "GAME OVER";
gameover.style.position = "absolute";
gameover.style.top = "50%";
gameover.style.left = "50%";
gameover.style.transform = "translate(-50%, -50%)";
gameover.style.display = "none";

const arenaMatrix = {
	data: ' ',
	isFood: function () {
		return this.data === FOOD;
	},
	isSnake: function () {
		return this.data === SNAKE;
	},
	prev: null,
	next: null,
	upper: null,
	lower: null,
};
const bufferDirections = [];

let currDirection = null;
let lastDirection = null;
let loopTimer = 0;
let head = null;
let tail = null;
let food = null;
let segments = 1;
let stopped = false;
let scoreNumber = 0

const getRandomArbitrary = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
}

const getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const initArenaMatrix = () => {

	const arenaNode = {
		data: ` `,
		isFood: function () {
			return this.data === FOOD;
		},
		isSnake: function () {
			return this.data === SNAKE;
		},
		prev: null,
		next: null,
		upper: null,
		lower: null,
	};

	let startNode = arenaMatrix;
	let finishNode = arenaMatrix;
	let lastUpperNode = null;

	for (let i = 0; i < ARENA_HEIGHT; i++) {

		if (i > 0) {

			// init first row element
			const firstRowNode = Object.assign({}, arenaNode);

			// firstRowNode.data = `${i}${0} `
			firstRowNode.upper = startNode;
			startNode.lower = firstRowNode;

			// set start and finish pointer to this element
			startNode = firstRowNode;
			finishNode = startNode;

			// link to the last first row element
			lastUpperNode = startNode.upper.next;
		}

		// for the rest of the element in the row
		for (let j = 1; j < ARENA_WIDTH; j++) {

			// create a new element
			const currNode = Object.assign({}, arenaNode);

			// currNode.data = `${i}${j} `;

			// link to the actual finish element of the row
			finishNode.next = currNode;
			currNode.prev = finishNode;
			finishNode = finishNode.next;

			// check if exist an element above or below the new one
			if (i > 0 && lastUpperNode !== null) {

				// if yes, link to them
				lastUpperNode.lower = finishNode;
				finishNode.upper = lastUpperNode;
				lastUpperNode = lastUpperNode.next;
			}

		}

		// link every row head-tail
		finishNode.next = startNode;
		startNode.prev = finishNode;
	}


	// link every column head-tail
	let start = arenaMatrix;
	let finish = arenaMatrix;

	let j = 0;

	while (j < ARENA_WIDTH) {

		// go til the end af the column
		while (finish.lower) {
			finish = finish.lower;
		}

		// link the end of the column with the head
		start.upper = finish;
		finish.lower = start;

		// move to the next column
		start = start.next;
		finish = start;

		j++;
	}
}

const initialPosition = () => {

	const startPosition = [10, 15];

	let curr = arenaMatrix;

	let i = 0;
	let j = 0;

	while (j < startPosition[0]) {
		curr = curr.next;
		j++;
	}

	while (i < startPosition[1]) {
		curr = curr.lower;
		i++;
	}

	curr.data = "*";
	head = curr;
	tail = curr;
}

const spawnFood = () => {
	const foodPosition = [getRandomInt(0, ARENA_WIDTH), getRandomInt(0, ARENA_HEIGHT)];

	food = arenaMatrix;

	let i = 0;
	let j = 0;

	while (j < foodPosition[0]) {
		food = food.next;
		j++;
	}

	while (i < foodPosition[1]) {
		food = food.lower;
		i++;
	}

	food.data = FOOD;
	segments++;
}

let tailDirections = {
	"ArrowUp": 'upper',
	"KeyW": 'upper',
	"ArrowDown": 'lower',
	"KeyS": 'lower',
	"ArrowLeft": 'prev',
	"KeyA": 'prev',
	"ArrowRight": 'next',
	"KeyD": 'next'
};

const directionManagement = (headNode) => {
	const headClone = Object.assign({}, headNode);
	bufferDirections.push(currDirection);

	head.data = tail.data;
	head = headNode;
	head.data = SNAKE;

	if (headClone.isSnake()) {
		stopped = true;
		gameover.style.display = 'block';
		return;
	}

	if (!headClone.isFood()) {
		tail.data = ' ';
		tail = tail[tailDirections[bufferDirections.shift()]];
		tail.data = SNAKE;
		scoreNumber += 1;
	} else {
		shift = false;
		scoreNumber += 10;
		spawnFood();
	}
}

const directions = {
	"ArrowUp": {
		direction: () => directionManagement(head.upper),
		opposite: ["ArrowDown", "KeyS"]
	},
	"KeyW": {
		direction: () => directionManagement(head.upper),
		opposite: ["ArrowDown", "KeyS"]
	},
	"ArrowDown": {
		direction: () => directionManagement(head.lower),
		opposite: ["ArrowUp", "KeyW"]
	},
	"KeyS": {
		direction: () => directionManagement(head.lower),
		opposite: ["ArrowUp", "KeyW"]
	},
	"ArrowLeft": {
		direction: () => directionManagement(head.prev),
		opposite: ["ArrowRight", "KeyD"]
	},
	"KeyA": {
		direction: () => directionManagement(head.prev),
		opposite: ["ArrowRight", "KeyD"]
	},
	"ArrowRight": {
		direction: () => directionManagement(head.next),
		opposite: ["ArrowLeft", "KeyA"]
	},
	"KeyD": {
		direction: () => directionManagement(head.next),
		opposite: ["ArrowLeft", "KeyA"]
	}
};

const draw = () => {

	directions[currDirection] && directions[currDirection].direction();

	let text = '';

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

	pre.innerText = text;
	score.innerText = scoreNumber.toString();
}

let shift = false;

const isValidDirection = (currDir) => {
	return currDir !== lastDirection &&
		!directions[currDir].opposite.includes(lastDirection);
}

const onKeyUp = (evt) => {
	if (isValidDirection(evt.code)) {
		currDirection = evt.code;
		clearInterval(loopTimer);
		draw();
		mainLoop();
		lastDirection = currDirection;
	}
}

const initKeyboardEvents = () => {
	document.addEventListener('keyup', onKeyUp);
}

const mainLoop = () => {
	loopTimer = setInterval(() => {
		if (stopped) {
			document.removeEventListener('keyup', onKeyUp);
			clearInterval(loopTimer);
			return;
		}
		draw();
	}, 200);
}

initArenaMatrix();
initialPosition();
spawnFood();
initKeyboardEvents();
mainLoop();