class SmartSwipeController {
	_start = { x: 0, y: 0 };
	/**
	 * Events Array. Can be changed
	 */
	eventNames = [
		"swipeleft", // 0
		"swiperight", // 1
		"swipeup", // 2
		"swipedown", // 3
		"tap", // 4
		"zoomin", // 5
		"zoomout", // 6
	];
	/**
	 * Apply additional tap events in HTML element
	 * @param {HTMLElement} element - any HTML element
	 * @param {number} offset - the zone of non-triggering side events in pixels (except for the tap event)
	 */
	constructor(element, offset = 5) {
		this.element = element;
		this.offset = offset;
		this.addEvents();
	}
	/**
	 * Manualy init events
	 */
	addEvents() {
		this._startEvent = (e) => {
			if (e.changedTouches) {
				if (e.changedTouches.length > 1) {
					this._start = {
						0: {
							x: e.changedTouches[0].screenX,
							y: e.changedTouches[0].screenY,
						},
						1: {
							x: e.changedTouches[1].screenX,
							y: e.changedTouches[1].screenY,
						},
					};
				} else {
					this._start.x = e.changedTouches[0].screenX;
					this._start.y = e.changedTouches[0].screenY;
				}
			} else {
				this._start.x = e.screenX;
				this._start.y = e.screenY;
			}
		};
		this._endEvent = (e) => {
			if (e.changedTouches?.length > 1) {
				this._multitouchHandler(e);
			} else
				this._handler(
					e.changedTouches ? e.changedTouches[0].screenX : e.screenX,
					e.changedTouches ? e.changedTouches[0].screenY : e.screenY,
					e
				);
		};

		this._events();
	}
	/**
	 * remove additional events
	 */
	removeEvents() {
		this._events("remove");
	}

	_events(a = "add") {
		this.element[a + "EventListener"]("touchstart", this._startEvent);
		this.element[a + "EventListener"]("mousedown", this._startEvent);

		this.element[a + "EventListener"]("touchend", this._endEvent);
		this.element[a + "EventListener"]("mouseup", this._endEvent);
	}
	_normalize(val) {
		const a = Math.abs(val) - this.offset;
		return a <= 0 ? 0 : a;
	}

	_handler(x, y, e) {
		const iX = x - this._start.x,
			iY = y - this._start.y;

		const normX = this._normalize(iX),
			normY = this._normalize(iY);

		if (normX === 0 && normY === 0) {
			this._triggerEvent(4, e);
		} else if (normX > normY) {
			if (iX < 0) {
				this._triggerEvent(0, e);
			} else if (iX > 0) {
				this._triggerEvent(1, e);
			}
		} else {
			if (iY < 0) {
				this._triggerEvent(2, e);
			} else if (iY > 0) {
				this._triggerEvent(3, e);
			}
		}
	}

	_multitouchHandler(e) {
		const { changedTouches } = e,
			distanceNew = this._getDistance(
				changedTouches[0],
				changedTouches[1]
			),
			distanceOld = this._getDistance(this._start[0], this._start[1]);
		if (distanceOld > distanceNew) {
			this._triggerEvent(5, e);
		} else {
			this._triggerEvent(6, e);
		}
	}

	_getEventName(eventId) {
		return this.eventNames[eventId];
	}
	_triggerEvent(eventId, event) {
		this.element.dispatchEvent(
			new Event(this._getEventName(eventId), event)
		);
	}
	_getDistance(a, b) {
		return Math.hypot(a.x - b.x, a.y - b.y);
	}
}

let scoresList = localStorage.getItem("2077scoreList")
	? JSON.parse(localStorage.getItem("2077scoreList"))
	: [];

function addToScoreList() {
	scoresList.unshift({
		time: new Date().toLocaleString(),
		score,
		steps: stepsCount,
	});
	scoresList = scoresList.filter((e) => e);
	scoresList.sort((a, b) => a.score < b.score);
	scoresList.length = 10;
	localStorage.setItem("2077scoreList", JSON.stringify(scoresList));
	isGameOver = true;
	updateScoreListUI();
	document.getElementById("aaa").checked = true;
}
let scoreListDiv = document.getElementById("scoreList");
function updateScoreListUI() {
	scoreListDiv.innerHTML = "";

	scoresList.forEach((e) => {
		if (!e) return;

		let li = document.createElement("li");
		li.textContent =
			"Счёт: " + e.score + "; Дата: " + e.time + "; Шаги: " + e.steps;
		scoreListDiv.appendChild(li);
	});
}
let isGameOver = false;
let score = 0;
let scoreCont = document.getElementById("score");
let stepsCount = 0;

function addScore(sc) {
	score += sc;
	updateScore();
}

function updateScore() {
	scoreCont.innerHTML = "Счёт: " + score + "<br>" + "Шаги: " + stepsCount;
}

let container = document.getElementById("container");

function startNewGame() {
	isGameOver = false;
	score = 0;
	stepsCount = 0;
	for (let i = 0; i < container.children.length; i++) {
		container.children[i].classList.remove(
			container.children[i].classList[1]
		);
	}

	add2ToCell(getRandomArrElement(getAllEmptyCells()));

	updateScore();
	document.getElementById("aaa").checked = false;
}

/**
 * Возвращает массив пустых ячеек
 * @returns {HTMLDivElement[]} массив пустых ячеек
 */
function getAllEmptyCells() {
	let emptyCells = [];
	for (let i = 0; i < container.children.length; i++) {
		const el = container.children[i];
		if (el.classList.length == 1) {
			emptyCells.push(el);
		}
	}
	return emptyCells;
}

/**
 * Получить случаное целое число от 0 до max
 * @param {Number} max до данного числа не включительно
 * @returns {Number} случайное число
 */
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

/**
 * Возвращает случайный элемент массива
 * @template T
 * @param {Array<T>} arr массив
 * @returns {T} элемент массива
 */
function getRandomArrElement(arr) {
	return arr[getRandomInt(arr.length)];
}

/**
 * Добавляет число 2 в ячейку
 * @param {HTMLDivElement} cell ячейка для добавления
 */
function add2ToCell(cell) {
	cell.classList.add("cell-2");
}

let c = container.children;

let field = [
	[c[0], c[1], c[2], c[3]],
	[c[4], c[5], c[6], c[7]],
	[c[8], c[9], c[10], c[11]],
	[c[12], c[13], c[14], c[15]],
];

let fieldReversed = [
	[c[0], c[4], c[8], c[12]],
	[c[1], c[5], c[9], c[13]],
	[c[2], c[6], c[10], c[14]],
	[c[3], c[7], c[11], c[15]],
];

function isEmpty(cell) {
	return cell.classList.length == 1;
}

function clearCell(cell) {
	cell.classList.remove(cell.classList[1]);
}
function cellUnion(row) {
	for (let i = 0; i < row.length; i++) {
		const cell = row[i];
		let cellClass = cell.classList[1];
		if (!cellClass) {
			continue;
		}
		for (let j = i + 1; j < row.length; j++) {
			const tempCell = row[j];
			if (!isEmpty(tempCell) && tempCell.classList[1] !== cellClass) {
				break;
			}
			if (tempCell.classList[1] == cellClass) {
				clearCell(cell);
				clearCell(tempCell);
				let totalScore =
					2 * Number(cellClass.substr(5, cellClass.length));
				tempCell.classList.add("cell-" + totalScore);

				addScore(totalScore);
				break;
			}
		}
	}
}
function cellMove(row) {
	for (let i = 2; i >= 0; i--) {
		let cell = row[i];

		if (cell.classList.length > 1) {
			let cellValue = cell.classList[1];

			for (let i = 3; i >= 0; i--) {
				let tempCell = row[i];
				if (tempCell === cell) {
					break;
				}
				if (tempCell.classList.length == 1) {
					cell.classList.remove(cellValue);
					tempCell.classList.add(cellValue);
					break;
				}
			}
		}
	}
}

function gameStep() {
	let emptyCellsArr = getAllEmptyCells();

	if (emptyCellsArr.length == 0) {
		alert(
			"Игра завершена. " + "Счёт: " + score + ", " + "шаги: " + stepsCount
		);

		addToScoreList();
	} else {
		add2ToCell(getRandomArrElement(emptyCellsArr));
		stepsCount++;
		updateScore();
	}
}
container.addEventListener("click", () => {
	if (isGameOver) {
		startNewGame();
	}
});

container.addEventListener("swipeleft", () => {
	field.forEach((row) => {
		let modRow = row.slice().reverse();
		cellUnion(modRow);
		cellMove(modRow);
	});

	gameStep();
});
container.addEventListener("swiperight", () => {
	field.forEach((row) => {
		cellUnion(row);
		cellMove(row);
	});

	gameStep();
});
container.addEventListener("swipeup", () => {
	fieldReversed.forEach((row) => {
		let modRow = row.slice().reverse();
		cellUnion(modRow);
		cellMove(modRow);
	});

	gameStep();
});
container.addEventListener("swipedown", () => {
	fieldReversed.forEach((row) => {
		cellUnion(row);
		cellMove(row);
	});

	gameStep();
});
startNewGame();
updateScore();
updateScoreListUI();
new SmartSwipeController(container);
