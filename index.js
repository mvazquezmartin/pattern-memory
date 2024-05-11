import { heart8bit } from './assets/svg.js';

const $squares = document.querySelectorAll('.square');
const $squaresRotate = document.querySelectorAll('.flip-square');
const $btnAction = document.querySelector('#btn-action');
const $tryCount = document.querySelector('.try');
const $life = document.querySelector('.life-container');
const $square_container = document.querySelector('.square-container');
const $square_row = document.querySelectorAll('.square-row');
const $flip_square = document.querySelector('.flip-square');

const squareSizeStr = getComputedStyle(
  document.documentElement
).getPropertyValue('--square-size');

const squareSizeNum = parseInt(squareSizeStr);
// test
const updateDOM = {
  squaresRotate: () => document.querySelectorAll('.flip-square'),
};

const context = new AudioContext();
const pattern = [];
const inputPattern = [];
const ATTEMPS = 3;
const MAX_ROW = 6;
let attemps = ATTEMPS;
let index_count = 0;
let total_pattern_square = 2;
let try_count = 0;
let best_count = 0;
let current_oscillator = null;

function jsNota(frecuencia, type = 'sine') {
  const o = context.createOscillator();
  const g = context.createGain();
  o.connect(g);
  o.type = type;
  o.frequency.value = frecuencia;
  g.connect(context.destination);
  o.start(0);
  g.gain.value = 0.5;
  g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.5);
  return o;
}

function getRandomNumber() {
  const $squares_update = document.querySelectorAll('.square');
  return Math.floor(Math.random() * $squares_update.length);
}

function pushPattern() {
  let numpattern = getRandomNumber();
  while (pattern.includes(numpattern)) {
    numpattern = getRandomNumber();
  }
  pattern.push(numpattern);
}

function generatePatttern() {
  if (total_pattern_square % 3 === 0) {
    const resizeSquare = squareSizeNum - 20;
    document.documentElement.style.setProperty(
      '--square-size',
      `${resizeSquare}px`
    );

    createNewArrowAndBlock();
  }
  const $squaresRotate_update = document.querySelectorAll('.flip-square');
  for (let i = 1; i <= total_pattern_square; i++) {
    pushPattern();
  }
  for (let i = 0; i < pattern.length; i++) {
    const active = pattern[i];
    // const noteFrequency = notes[active];
    // jsNota(noteFrequency);

    $squaresRotate_update[active].classList.add('rotate-square');

    setTimeout(() => {
      $squaresRotate_update.forEach((square) => {
        square.classList.remove('rotate-square');
      });
    }, 1000);
  }
}

function checkPattern(input) {
  if (pattern.includes(input)) {
    inputPattern.push(input);

    if (pattern.length === inputPattern.length) {
      total_pattern_square++;
      return 'Next';
    }

    return true;
  } else {
    return false;
  }
}

function clickListener() {
  $squaresRotate.forEach((square, index) => {
    square.addEventListener('click', () => {
      const resultCheckPattern = checkPattern(index);

      if (resultCheckPattern) {
        square.classList.add('rotate-square');

        if (resultCheckPattern === 'Next') {
          // const $squaresRotate = document.querySelectorAll('.flip-square');

          $squaresRotate.forEach((square) => {
            setTimeout(() => {
              square.classList.remove('rotate-square');
            }, 1000);
          });

          resetValue();

          setTimeout(() => {
            generatePatttern();
          }, 2500);
          console.log('click Listener');
        }
      } else {
        const flipSquareInner = square.children[0];
        const $flipSquareFront = flipSquareInner.children[0];
        $flipSquareFront.classList.add('front-wrong');

        try_count++;
        $tryCount.textContent = `Try: ${try_count}`;

        if (try_count === 3) {
          attemps--;
          if (attemps === 0) {
            console.log('lose');
            return;
          }

          pattern.length = 0;
          inputPattern.length = 0;

          const front_wrong = document.querySelectorAll('.flip-square-front');
          front_wrong.forEach((square) => {
            setTimeout(() => {
              square.classList.remove('front-wrong');
            }, 700);
          });

          try_count = 0;
          console.log('Hola');
          restHeart();

          setTimeout(() => {
            generatePatttern();
          }, 1500);
        }
      }
    });
  });
}

function createHearts() {
  for (let i = 0; i < ATTEMPS; i++) {
    const heart = document.createElement('div');
    heart.classList.add('svg-heart');
    heart.innerHTML = heart8bit;
    $life.appendChild(heart);
  }
  $life.style.visibility = 'visible';
}

function restHeart() {
  const hearts = document.querySelectorAll('.life-container svg');
  for (let i = 0; i < hearts.length; i++) {
    if (i < attemps) {
      hearts[i].style.fill = '#FF0000';
    } else {
      hearts[i].style.fill = '#CCC';
    }
  }
}

function createNewArrowAndBlock() {
  $square_row.forEach((row) => {
    const newSquare = $flip_square.cloneNode(true);
    row.appendChild(newSquare);
  });
  const row = $square_row[0].cloneNode(true);
  $square_container.appendChild(row);
}

function resetValue() {
  pattern.length = 0;
  inputPattern.length = 0;
  try_count = 0;
}

function init() {
  createHearts();
  generatePatttern();
  clickListener();
}

$btnAction.addEventListener('click', () => {
  // createNewArrowAndBlock();
  init();
  // $btnAction.style.visibility = 'hidden';
});
