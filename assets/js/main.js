// Variables

let firstOperand,
	secondOperand,
	currentOperator,
	shouldDisplayResult = false,
	shouldResetDisplay = false,
	hasEqualBeenPressed = false;

// DOM Elements

const themeButton = document.querySelector(".theme-button");
const calculatorBody = document.querySelector(".calculator-body");
const display = document.querySelector(".display");
const history = document.querySelector(".history");

// Event Listeners

themeButton.addEventListener("click", changeTheme);

calculatorBody.addEventListener("click", handleButtonInput);
window.addEventListener("keydown", handleKeyboardInput);

// Functions

// Change the theme depending on the user preference

function changeTheme({ target: button }) {
	window.matchMedia("(prefers-color-scheme: light)").matches
		? document.body.classList.toggle("dark-theme")
		: document.body.classList.toggle("light-theme");

	button.blur();
}

// Setter & Updater Functions

const setFirstOperand = newOperand => (firstOperand = newOperand);

const setSecondOperand = newOperand => (secondOperand = newOperand);

const setCurrentOperator = newOperator => (currentOperator = newOperator);

const setShouldDisplayResult = newBoolean => (shouldDisplayResult = newBoolean);

const setShouldResetDisplay = newBoolean => (shouldResetDisplay = newBoolean);

const setHasEqualBeenPressed = newBoolean => (hasEqualBeenPressed = newBoolean);

const setDisplayText = newDisplayText => (display.textContent = newDisplayText);

const setHistoryText = newHistoryText => (history.textContent = newHistoryText);

const updateDisplayText = newDisplayText =>
	(display.textContent += newDisplayText);

// Check if button has a specific class & then execute the respective function

function handleButtonInput({ target: button }) {
	switch (true) {
		case button.classList.contains("number"):
			addNumber(button.textContent);
			break;

		case button.classList.contains("decimal-point"):
			addDecimalPoint();
			break;

		case button.classList.contains("operator"):
			addOperator(button.textContent);
			break;

		case button.classList.contains("remove"):
			removeLastDigit();
			break;

		case button.classList.contains("clear"):
			clearDisplay();
			break;

		case button.classList.contains("equal"):
			showOperationResult();
			break;
	}

	button.blur();
}

// Handle keyboard input & return the function associated with the respective keys

function handleKeyboardInput({ key }) {
	switch (true) {
		case Number(key) >= 0 && Number(key) <= 9:
			addNumber(key);
			break;

		case key === ".":
			addDecimalPoint();
			break;

		case ["+", "-", "/", "*"].includes(key):
			handleOperator(key);
			break;

		case key === "Backspace":
			removeLastDigit();
			break;

		case key === "Enter":
			showOperationResult();
			break;
	}
}

// Translate the keyboard's operators and return addOperator

function handleOperator(operator) {
	const OPERATORS = {
		"+": "+",
		"-": "-",
		"*": "×",
		"/": "÷",
	};

	return addOperator(OPERATORS[operator]);
}

// Add a number to the display

function addNumber(buttonValue) {
	if (display.textContent === "Error" || display.textContent === "Infinity") {
		clearDisplay();
	}

	if (shouldResetDisplay) {
		setDisplayText("");
		setShouldResetDisplay(false);
		setShouldDisplayResult(true);
	}

	if (hasEqualBeenPressed) {
		setHistoryText("");
		setShouldDisplayResult(false);
		setHasEqualBeenPressed(false);
	}

	if (display.textContent.length > 12) {
		return;
	}

	display.textContent === "0"
		? setDisplayText(buttonValue)
		: updateDisplayText(buttonValue);
}

// Add a decimal point to the display

function addDecimalPoint() {
	if (!display.textContent.includes(".")) {
		updateDisplayText(".");
	}

	if (shouldResetDisplay && hasEqualBeenPressed) {
		setHistoryText("");
	}

	if (shouldResetDisplay) {
		setDisplayText("0.");
		setShouldResetDisplay(false);
		setShouldDisplayResult(true);
	}
}

// Add the clicked operator to the display or show the result of the operation

function addOperator(buttonValue) {
	if (display.textContent.endsWith(".")) {
		setDisplayText(display.textContent.slice(0, -1));
	}

	if (shouldDisplayResult) {
		setSecondOperand(display.textContent);

		setDisplayText(operate(currentOperator, firstOperand, secondOperand));
		setHistoryText(`${display.textContent} ${buttonValue}`);

		if (display.textContent === "Error" || display.textContent === "Infinity") {
			setHistoryText("");
		}

		setCurrentOperator(buttonValue);
		setFirstOperand(display.textContent);
		setShouldDisplayResult(false);
	} else {
		setCurrentOperator(buttonValue);
		setFirstOperand(display.textContent);
		setHistoryText(`${firstOperand} ${currentOperator}`);
	}

	setShouldResetDisplay(true);
	setHasEqualBeenPressed(false);

	if (display.textContent === "Error" || display.textContent === "Infinity") {
		clearDisplay();
	}
}

// Remove the last digit from the display

function removeLastDigit() {
	if (shouldResetDisplay) {
		// debugger;

		if (hasEqualBeenPressed) {
			setHistoryText("");
		}
	} else {
		if (display.textContent.length > 1) {
			setDisplayText(display.textContent.slice(0, -1));
		} else {
			setDisplayText("0");
		}
	}
}

// Clear the display and reset the calculator

function clearDisplay() {
	setDisplayText("0");
	setHistoryText("");

	setFirstOperand(undefined);
	setSecondOperand(undefined);
	setCurrentOperator(undefined);
	setShouldDisplayResult(false);
	setShouldResetDisplay(false);
	setHasEqualBeenPressed(false);
}

// Show the operation result to the display

function showOperationResult() {
	if (!currentOperator) return;

	if (display.textContent === "Error" || display.textContent === "Infinity") {
		clearDisplay();
	}

	if (display.textContent.endsWith(".")) {
		setDisplayText(display.textContent.slice(0, -1));
	}

	if (hasEqualBeenPressed) {
		setFirstOperand(display.textContent);
	} else {
		setSecondOperand(display.textContent);
	}

	setHistoryText(`${firstOperand} ${currentOperator} ${secondOperand} =`);
	setDisplayText(operate(currentOperator, firstOperand, secondOperand));

	setShouldResetDisplay(true);
	setHasEqualBeenPressed(true);
	setShouldDisplayResult(false);
}

// Return the result of the operation depending on the operator

function operate(operator, a, b) {
	const OPERATIONS = {
		"+": (a, b) => a + b,
		"-": (a, b) => a - b,
		"×": (a, b) => a * b,
		"÷": (a, b) => a / b,
	};

	const result = OPERATIONS[operator](Number(a), Number(b));

	if (result.toString().includes(".")) {
		return Math.round(result * 10000) / 10000;
	}

	return isNaN(result) ? `Error` : result;
}
