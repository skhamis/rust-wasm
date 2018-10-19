import { Universe } from "rust-wasm-game";


const pre = document.getElementById("game-of-life-canvas");
const universe = Universe.new();

const renderLoop = () => {
    pre.textContent = universe.render();
    universe.tick();
  
    requestAnimationFrame(renderLoop);
  };

  console.log("test");
  requestAnimationFrame(renderLoop);
