const container = document.querySelector('.container');
const clearButton = document.querySelector('#clear');
const eraseButton = document.querySelector('#erase');
const blackButton = document.querySelector('#black');
const randomButton = document.querySelector('#random');
const pickerButton = document.querySelector('#pick');
const pickerInput = document.querySelector('#color-picker');
const toggleGridButton = document.querySelector('#toggle-grid');
const rainbowButton = document.querySelector('#rainbow');
const darkenButton = document.querySelector('#darken');
const lightenButton = document.querySelector('#lighten');

// TODO: refactor code so that there is one query selector for all buttons
//! use forEach to add event listeners and use ID to execute correctly

// TODO: allow user to select grid size from a slider instead of a prompt

// TODO: alternative random colors? one for cool colors, one for warm, one for truly random?

let currentMode = 'black';
let gridItem;
let currentRainbowColor = 'violet';

//* random hex color:
const randomColor = function generateRandomHexColor(element) {
  const div = element;
  div.style.background = `#${Math.floor(Math.random() * 16777215).toString(
    16
  )}`;
};

//* sets color in order of rainbow
const rainbowColor = function generateColorsInRainbowOrder(element) {
  const div = element;
  const rainbowArray = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'indigo',
    'violet',
  ];
  const lastIndex = rainbowArray.length - 1;
  if (currentRainbowColor === rainbowArray[lastIndex]) {
    // eslint-disable-next-line prefer-destructuring
    currentRainbowColor = rainbowArray[0];
  } else {
    const nextIndex = rainbowArray.indexOf(currentRainbowColor) + 1;
    currentRainbowColor = rainbowArray[nextIndex];
  }
  div.style.background = currentRainbowColor;
};

//* erases all color and resets brightness level
const erase = function eraseColorAndBrightness(element) {
  const div = element;
  div.style.background = 'white';
  div.style.setProperty('--brightness-level', 1);
};

//* darkens grid item by 10% on each pass
const darkenGridItem = function darkenGridItemGradually(element) {
  const div = element;
  const currentBrightness = +getComputedStyle(div).getPropertyValue(
    '--brightness-level'
  );
  const nextBrightness = currentBrightness - 0.1;
  if (currentBrightness > 0) {
    div.style.setProperty('--brightness-level', nextBrightness);
  }
};

//* lightens grid item by 10% on each pass
const lightenGridItem = function lightenGridItemGradually(element) {
  const div = element;
  const currentBackgroundColor = getComputedStyle(div).getPropertyValue(
    'background-color'
  );

  // if current color is black, set to white with 0% brightness
  // black cannot be lightened with brightness
  if (currentBackgroundColor === 'rgb(0, 0, 0)') {
    div.style.setProperty('--brightness-level', 0);
    div.style.background = 'white';
  }

  const currentBrightness = +getComputedStyle(div).getPropertyValue(
    '--brightness-level'
  );
  const nextBrightness = currentBrightness + 0.1;

  div.style.setProperty('--brightness-level', nextBrightness);
};

//* creates grid from user input; defaults to 16x16
const createGrid = function createGridFromUserInput(divsPerSide = 16) {
  let totalDivs;
  if (divsPerSide >= 100) {
    totalDivs = 10000;
  } else {
    totalDivs = divsPerSide * divsPerSide;
  }
  for (let i = 0; i < totalDivs; i += 1) {
    const div = document.createElement('div');
    div.classList.add('grid-item');
    container.style.setProperty('--divs-per-side', divsPerSide);
    container.append(div);
    gridItem = document.querySelectorAll('.grid-item');
  }
};

const changeColor = function changeDivColorOnHover(element) {
  const div = element;
  if (!container.classList.contains('disabled')) {
    if (typeof currentMode === 'function') {
      currentMode(div);
    } else {
      div.style.background = currentMode;
    }
  }
};

//* enables hover functionality; defaults to black
const hover = function changeColorOnHover() {
  gridItem.forEach(item => {
    item.addEventListener('mouseenter', function update() {
      changeColor(this);
    });
  });
};

const askUser = function askUserForDivs() {
  // eslint-disable-next-line no-alert
  const divs = prompt('How many squares should each side of the grid take up?');
  if (!divs) {
    return 16;
  }
  return divs;
};

const clearBoard = function resetAllDivsToBlank() {
  gridItem.forEach(item => item.remove());
};

//* check if gridItems contain the grid-lines class
const checkGrid = function checkIfGridLinesAreEnabled() {
  const gridItemArray = Array.from(gridItem);
  return gridItemArray.every(item => item.classList.contains('grid-lines'));
};

//* clears board and resets grid to user-defined size on button click
clearButton.addEventListener('click', () => {
  const currentGridLineStatus = checkGrid();
  clearBoard();
  createGrid(askUser());
  if (currentGridLineStatus) {
    gridItem.forEach(item => item.classList.add('grid-lines'));
  }
  hover();
});

const setMode = function setCurrentMode(color) {
  currentMode = color;
};

eraseButton.addEventListener('click', () => setMode(erase));
blackButton.addEventListener('click', () => setMode('black'));
randomButton.addEventListener('click', () => setMode(randomColor));
rainbowButton.addEventListener('click', () => setMode(rainbowColor));
darkenButton.addEventListener('click', () => setMode(darkenGridItem));
lightenButton.addEventListener('click', () => setMode(lightenGridItem));

toggleGridButton.addEventListener('click', () => {
  container.classList.toggle('container-thicker-border');
  gridItem.forEach(item => item.classList.toggle('grid-lines'));
});

pickerInput.addEventListener('input', e => setMode(e.target.value));
pickerInput.addEventListener('change', e => setMode(e.target.value));

pickerButton.addEventListener('click', () => {
  pickerInput.focus();
  pickerInput.click();
});

//* toggles drawing capability with click on container
container.addEventListener('click', () => {
  container.classList.toggle('disabled');
});

document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  gridItem.forEach(item => item.classList.add('grid-lines'));
  hover();
});
