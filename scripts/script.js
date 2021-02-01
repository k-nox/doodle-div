const container = document.querySelector('.container');
const clearButton = document.querySelector('#clear');
let gridItem;

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
createGrid();

const changeColor = function changeDivColorOnHover(element, colorClass) {
  element.classList.add(colorClass);
};

//* enables hover functionality; defaults to black
const hover = function changeColorOnHover(colorClass = 'black') {
  gridItem.forEach(item => {
    item.addEventListener('mouseenter', function event() {
      changeColor(this, colorClass);
    });
  });
};
hover();

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

//* clears board and resets grid to user-defined size on button click
clearButton.addEventListener('click', () => {
  clearBoard();
  createGrid(askUser());
  hover();
});
