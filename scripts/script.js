const container = document.querySelector('.container');
const buttons = document.querySelectorAll('button');
const pickerInput = document.querySelector('#color-picker');

// TODO: allow user to select grid size from a slider instead of a prompt

let currentMode = 'black';
let gridItems;
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
    gridItems = document.querySelectorAll('.grid-item');
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
  gridItems.forEach(item => {
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
  gridItems.forEach(item => item.remove());
};

//* check if gridItems contain the grid-lines class
const checkGrid = function checkIfGridLinesAreEnabled() {
  const gridItemArray = Array.from(gridItems);
  return gridItemArray.every(item => item.classList.contains('grid-lines'));
};

//* clears board and resets grid to user-defined size on button click
const clear = function clearEverything() {
  const currentGridLineStatus = checkGrid();
  clearBoard();
  createGrid(askUser());
  if (currentGridLineStatus) {
    gridItems.forEach(item => item.classList.add('grid-lines'));
  }
  hover();
};

const setMode = function setCurrentMode(color) {
  currentMode = color;
};

pickerInput.addEventListener('change', e => setMode(e.target.value));

//* toggles drawing capability with click on container
container.addEventListener('click', () => {
  container.classList.toggle('disabled');
});

buttons.forEach(button =>
  button.addEventListener('click', e => {
    switch (e.target.id) {
      case 'black':
        setMode('black');
        break;
      case 'erase':
        setMode(erase);
        break;
      case 'random':
        setMode(randomColor);
        break;
      case 'rainbow':
        setMode(rainbowColor);
        break;
      case 'darken':
        setMode(darkenGridItem);
        break;
      case 'lighten':
        setMode(lightenGridItem);
        break;
      case 'pick':
        pickerInput.focus();
        pickerInput.click();
        break;
      case 'clear':
        clear();
        break;
      case 'toggle-grid':
        container.classList.toggle('container-thicker-border');
        gridItems.forEach(item => item.classList.toggle('grid-lines'));
        break;
      // no default
    }
  })
);

document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  gridItems.forEach(item => item.classList.add('grid-lines'));
  hover();
});
