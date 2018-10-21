import { Universe, Cell } from "rust-wasm-game";
import { memory } from "rust-wasm-game/rust_wasm_game_bg";

const CELL_SIZE =   10; //in px
const GRID_COLOR =  "#CCCCCC";
const DEAD_COLOR =  "#FFFFFF";
const ALIVE_COLOR = "#000000";

//const pre = document.getElementById("game-of-life-canvas");
let universe = Universe.new();
const u_width = universe.width();
const u_height = universe.height();

// Canvas way
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * u_height + 1;
canvas.width = (CELL_SIZE + 1) * u_width + 1;

const ctx = canvas.getContext('2d');
let animationId = null;


//Play pause section
const isPaused = () => {
  return animationId === null;
}

const playPauseButton = document.getElementById("play-pause-btn");
const restartButton = document.getElementById("restart-btn");

const Play = () => {
  playPauseButton.textContent = "Pause the game";
  renderLoop();
};

const Pause = () => {
  playPauseButton.textContent = "Resume";
  cancelAnimationFrame(animationId);
  animationId = null;
};

const Restart = () => {
  Pause();
  universe = Universe.new();
  Play();
}

restartButton.addEventListener("click", event => {
  Restart();
});

playPauseButton.addEventListener("click", event => {
  isPaused() ? Play() : Pause();
});


const getIndex = (row, column) => {
  return row * u_width + column;
}

const drawGrid = () =>  {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  //Vertical lines 
  for (var i = 0; i <= u_width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      ctx.lineTo(
        i * (CELL_SIZE + 1) + 1, 
        (CELL_SIZE + 1) * u_height + 1,
      );
  }

  // Horizontal lines
  for (var j = 0; j <= u_height; j++) {
    ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * u_width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, u_width * u_height);

  ctx.beginPath();

  for (let row = 0; row < u_height; row++) {
    for (let col = 0; col < u_width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = cells[idx] === Cell.Dead
        ? DEAD_COLOR
        : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};


//Main animation loops
const renderLoop = () => {
  // pre.textContent = universe.render();
  universe.tick();

  drawGrid();
  drawCells();

  animationId = requestAnimationFrame(renderLoop);
};

//Start the game
Play();

