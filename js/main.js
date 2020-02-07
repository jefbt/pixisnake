// Instantiate PIXI's view
let app;

window.onload = function() {
  app = new PIXI.Application(
    {
      width: defs.boundaries,
      height: defs.boundaries,
      backgroundColor: defs.bgColor
    }
  );
  document.getElementById('canvasContainer')
    .appendChild(app.view);
  start();
}

function start() {
  window.addEventListener("keydown", keyDown);

  globals.boundaries = defs.boundaries;

  app.view.width = globals.boundaries;
  app.view.height = globals.boundaries;

  const pos = {
    x: Math.floor(globals.boundaries / defs.size / 2),
    y: Math.floor(globals.boundaries / defs.size / 2)
  }
  globals.snake = new Snake(app.stage, pos, gameOver);

  globals.nextFood = Date.now() + defs.foodTime;
  globals.loop = setInterval(update, defs.speed);

  globals.scoreHolder = document.getElementById("score");

  globals.highScore = localStorage.getItem("highScore") || -1;
  changeScore(0);
}

function update() {
  if (globals.snake) {
    const adjust = globals.snake.update();
    foodOverlap();
    if (adjust) {
      adjustScreen();
    }
    if (globals.nextFood < Date.now()) {
      addFood();
      globals.nextFood = Date.now() + defs.foodTime;
    }
    verifyFood();
  }
}

function adjustScreen() {
  if (globals.boundaries > defs.shrinkScreen) {
    globals.boundaries -= defs.shrinkScreen;
    app.view.width = globals.boundaries;
    app.view.height = globals.boundaries;
  } else {
    gameOver();
  }
}

function keyDown(e) {
  switch(e.keyCode) {
    case 38: // Up
      changeDirection(0);
      break;
    case 39: // Right
      changeDirection(3);
      break;
    case 40: // Down
      changeDirection(1);
      break;
    case 37: // Left
      changeDirection(2);
      break;
  }
  }

function changeDirection(direction) {
  if (globals.snake) {
    globals.snake.turn(direction);
  }
}

function changeScore(points) {
  globals.score += points;
  globals.scoreHolder.innerText = String(defs.scoreText + ": " + globals.score);
  if (globals.highScore > -1 &&
      globals.score > globals.highScore)
  {
    document.getElementById("score").style.color = "#5c5";
  } else {
    document.getElementById("score").style.color = "#000";
  }
}

function addFood() {
  globals.foodList.push(new Food(app.stage));
}

function foodOverlap() {
  for(var f in globals.foodList) {
    if (globals.foodList[f].overlaps(globals.snake.head.pos)) {
      globals.snake.eat(globals.foodList[f].power);
      changeScore(globals.foodList[f].score);
      globals.foodList[f].destroy();
      globals.foodList[f] = null;
      globals.foodList.splice(f, 1);
    }
  }
}

function verifyFood() {
  for(var f in globals.foodList) {
    if (globals.foodList[f].timeout < Date.now()) {
      globals.foodList[f].destroy();
      globals.foodList[f] = null;
      globals.foodList.splice(f, 1);
    }
  }
}

function clearFoodList() {
  while(globals.foodList.length > 0) {
    globals.foodList.pop().destroy();
  }
}

function gameOver() {
  app.view.width = 0;
  app.view.height = 0;
  globals.snake.destroy();
  globals.snake = null;
  clearFoodList();
  
  const playAgain = document.getElementById("playAgain");
  playAgain.style.display = "flex";
  playAgain.onclick = restartGame;

  const lastScore = localStorage.getItem("highScore");
  if (globals.score > lastScore) {
    localStorage.setItem("highScore", globals.score);
  }
}

function restartGame() {
  playAgain.style.display = "none";
  clearInterval(globals.loop);
  globals.foodList = [];
  globals.nextFood = 0;
  globals.score = 0;
  globals.highScore = -1;
  changeScore(0);
  start();
}