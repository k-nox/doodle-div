const container = document.querySelector('.container');
const buttons = document.querySelectorAll('button');
const pickerInput = document.querySelector('#color-picker');

let currentMode = 'black';
let gridItems;
let currentRainbowColor = 'violet';

const setMode = function setCurrentMode(color) {
  currentMode = color;
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

//* enables hover functionality; defaults to black
function changeColorOnHover() {
  gridItems.forEach(item => {
    item.addEventListener('mouseenter', function updateMode() {
      changeColor(this);
    });
  });
}

function changeColor(item) {
  const div = item;
  if (!container.classList.contains('disabled')) {
    if (typeof currentMode === 'function') {
      currentMode(div);
    } else {
      div.style.background = currentMode;
    }
  }
}

//* generates random hex color
function randomColor(item) {
  const div = item;
  div.style.background = `#${Math.floor(Math.random() * 16777215).toString(
    16
  )}`;
}

//* sets color in order of rainbow
const rainbowColor = function generateColorsInRainbowOrder(item) {
  const div = item;
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

//* darkens grid item by 10% on each pass
const darkenGridItem = function darkenGridItemGradually(item) {
  const div = item;
  const currentBrightness = +getComputedStyle(div).getPropertyValue(
    '--brightness-level'
  );
  const nextBrightness = currentBrightness - 0.1;
  if (currentBrightness > 0) {
    div.style.setProperty('--brightness-level', nextBrightness);
  }
};

//* lightens grid item by 10% on each pass
const lightenGridItem = function lightenGridItemGradually(item) {
  const div = item;
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

//* erases all color and resets brightness level on hover
const erase = function eraseColorAndBrightness(item) {
  const div = item;
  div.style.background = 'white';
  div.style.setProperty('--brightness-level', 1);
};

//* clears board and resets grid to user-defined size on button click
const clear = function clearEverything() {
  const currentGridLineStatus = checkGrid();
  clearBoard();
  createGrid(askUser());
  if (currentGridLineStatus) {
    gridItems.forEach(item => item.classList.add('grid-lines'));
  }
  changeColorOnHover();
};

function checkGrid() {
  const gridItemArray = Array.from(gridItems);
  return gridItemArray.every(item => item.classList.contains('grid-lines'));
}

function clearBoard() {
  gridItems.forEach(item => item.remove());
}

function askUser() {
  // eslint-disable-next-line no-alert
  const divs = prompt('How many squares should each side of the grid take up?');
  if (!divs) {
    return 16;
  }
  return divs;
}

//* toggles drawing capability with click on container
container.addEventListener('click', () => {
  container.classList.toggle('disabled');
});

pickerInput.addEventListener('change', e => setMode(e.target.value));

buttons.forEach(button =>
  button.addEventListener('click', e => {
    switch (e.target.id) {
      case 'black':
        setMode('black');
        break;
      case 'pick':
        pickerInput.focus();
        pickerInput.click();
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
      case 'erase':
        setMode(erase);
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

/* //* enables hover functionality; defaults to black
function changeColorOnHover() {
  gridItems.forEach(item => {
    item.addEventListener('mouseenter', function updateMode() {
      changeColor(this);
    });
  });
} */

document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  gridItems.forEach(item => item.classList.add('grid-lines'));
  changeColorOnHover();
});
