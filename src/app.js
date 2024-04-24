import { run, setAssets } from "./engine.js";

const MovementArea = document.getElementById("movement-area");
const Score = document.getElementById("score");
const Gameover = document.getElementById("gameover");

setAssets({
  arenaElement: MovementArea,
  scoreElement: Score,
  gameoverElement: Gameover,
});

run();
