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
const createGrid = function createGridFromUserInput(itemsPerSide = 16) {
  let totalItems;
  if (itemsPerSide >= 100) {
    totalItems = 10000;
  } else {
    totalItems = itemsPerSide * itemsPerSide;
  }
  for (let i = 0; i < totalItems; i += 1) {
    const item = document.createElement('div');
    item.classList.add('grid-item');
    container.style.setProperty('--items-per-side', itemsPerSide);
    container.append(item);
    gridItems = document.querySelectorAll('.grid-item');
  }
};

//* enables hover functionality; defaults to black
const hover = function changeColorOnHover() {
  gridItems.forEach(item => {
    item.addEventListener('mouseenter', function updateMode() {
      changeColor(this);
    });
  });
};

const changeColor = function changeColorBasedOnCurrentMode(item) {
  const currentItem = item;
  if (!container.classList.contains('disabled')) {
    if (typeof currentMode === 'function') {
      currentMode(currentItem);
    } else {
      currentItem.style.background = currentMode;
    }
  }
};

//* generates random hex color
const randomColor = function generateRandomColor(item) {
  const currentItem = item;
  currentItem.style.background = `#${Math.floor(
    Math.random() * 16777215
  ).toString(16)}`;
};

//* sets color in order of rainbow
const rainbowColor = function generateColorsInRainbowOrder(item) {
  const currentItem = item;
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
  currentItem.style.background = currentRainbowColor;
};

//* darkens grid item by 10% on each pass
const darkenGridItem = function darkenGridItemGradually(item) {
  const currentItem = item;
  const currentBrightness = +getComputedStyle(currentItem).getPropertyValue(
    '--brightness-level'
  );
  const nextBrightness = currentBrightness - 0.1;
  if (currentBrightness > 0) {
    currentItem.style.setProperty('--brightness-level', nextBrightness);
  }
};

//* lightens grid item by 10% on each pass
const lightenGridItem = function lightenGridItemGradually(item) {
  const currentItem = item;
  const currentBackgroundColor = getComputedStyle(currentItem).getPropertyValue(
    'background-color'
  );
  // if current color is black, set to white with 0% brightness
  // black cannot be lightened with brightness
  if (currentBackgroundColor === 'rgb(0, 0, 0)') {
    currentItem.style.setProperty('--brightness-level', 0);
    currentItem.style.background = 'white';
  }

  const currentBrightness = +getComputedStyle(currentItem).getPropertyValue(
    '--brightness-level'
  );
  const nextBrightness = currentBrightness + 0.1;

  currentItem.style.setProperty('--brightness-level', nextBrightness);
};

//* erases all color and resets brightness level on hover
const erase = function eraseColorAndBrightness(item) {
  const currentItem = item;
  currentItem.style.background = 'white';
  currentItem.style.setProperty('--brightness-level', 1);
};

//* clears board and resets grid to user-defined size on button click
const clear = function clearEverything() {
  const currentGridLineStatus = checkGrid();
  const currentItemsPerSide = Math.sqrt(gridItems.length);
  const newItemsPerSide = askUser(currentItemsPerSide);
  if (newItemsPerSide) {
    clearContainer();
    createGrid(newItemsPerSide);
    if (currentGridLineStatus) {
      gridItems.forEach(item => item.classList.add('grid-lines'));
    }
    hover();
  }
};

const checkGrid = function checkCurrentGridLineStatus() {
  const gridItemArray = Array.from(gridItems);
  return gridItemArray.every(item => item.classList.contains('grid-lines'));
};

const clearContainer = function clearAllItemsFromContainer() {
  gridItems.forEach(item => item.remove());
};

const askUser = function askUserForNewGridSize(currentItemsPerSide) {
  // eslint-disable-next-line no-alert
  let itemsPerSide = prompt(
    'How many squares should each side of the grid be?'
  );
  const numRegex = /^-?\d+$/;
  const whiteSpace = /\s/g;
  if (itemsPerSide === null) {
    return null;
  }
  itemsPerSide = itemsPerSide.replace(whiteSpace, '');
  if (numRegex.test(itemsPerSide)) {
    itemsPerSide = Math.round(+itemsPerSide);
    if (itemsPerSide < 1) {
      return 1;
    }
    return itemsPerSide;
  }
  return currentItemsPerSide;
};

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

document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  gridItems.forEach(item => item.classList.add('grid-lines'));
  hover();
});
