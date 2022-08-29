// DOM Elements

const themeButton = document.querySelector(".theme-button");

// Event Listeners

themeButton.addEventListener("click", changeTheme);

// Functions

// Change the theme depending on the user preference

function changeTheme() {
	window.matchMedia("(prefers-color-scheme: light)").matches
		? document.body.classList.toggle("dark-theme")
		: document.body.classList.toggle("light-theme");
}