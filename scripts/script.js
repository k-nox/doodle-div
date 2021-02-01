const container = document.querySelector('.container');
const clearButton = document.querySelector('#clear');
const eraseButton = document.querySelector('#erase');
const blackButton = document.querySelector('#black');
const randomButton = document.querySelector('#random');
const pickerButton = document.querySelector('#pick');
const pickerInput = document.querySelector('#color-picker');
const toggleGridButton = document.querySelector('#toggle-grid');
const rainbowButton = document.querySelector('#rainbow');

// TODO: create buttons to incrementally darken or lighten a square by 10%

// TODO: allow user to select grid size from a slider instead of a prompt

// TODO: alternative random colors? one for cool colors, one for warm, one for truly random?

let currentColor = 'black';
let gridItem;
let currentRainbowColor = 'violet';

//* random hex color:
const randomColor = function generateRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

//* sets color in order of rainbow
const rainbowColor = function generateColorsInRainbowOrder() {
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
  return currentRainbowColor;
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
    if (typeof currentColor === 'function') {
      div.style.background = currentColor();
    }
    div.style.background = currentColor;
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

eraseButton.addEventListener('click', () => (currentColor = 'transparent'));
blackButton.addEventListener('click', () => (currentColor = 'black'));
randomButton.addEventListener('click', () => (currentColor = randomColor));
rainbowButton.addEventListener('click', () => (currentColor = rainbowColor));
toggleGridButton.addEventListener('click', () => {
  container.classList.toggle('container-thicker-border');
  gridItem.forEach(item => item.classList.toggle('grid-lines'));
});

pickerInput.addEventListener('input', e => (currentColor = e.target.value));
pickerInput.addEventListener('change', e => (currentColor = e.target.value));

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
