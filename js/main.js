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

let snake;
let nextFood = 0;
let scoreHolder;
let score = 0;

function start() {
  // listeners
  window.addEventListener("keydown", keyDown);

  globals.screenCorrection = globals.boundaries % defs.size;

  const pos = {
    x: Math.floor(globals.boundaries / defs.size / 2),
    y: Math.floor(globals.boundaries / defs.size / 2)
  }
  snake = new Snake(app.stage, pos);

  nextFood = Date.now() + defs.foodTime;
  setInterval(update, defs.speed);

  scoreHolder = document.getElementById("score");
  changeScore(0);
}

function update() {
  if (snake) {
    const adjust = snake.update();
    foodOverlap();
    if (adjust) {
      adjustScreen();
    }
    if (nextFood >= Date.now()) {
      addFood();
      nextFood = Date.now() + defs.foodTime;
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
  if (snake) {
    snake.turn(direction);
  }
}

function changeScore(points) {
  score += points;
  scoreHolder.innerText = String(defs.scoreText + ": " + score);
}

function addFood() {
  globals.foodList.push(new Food(app.stage));
}

function foodOverlap() {
  for(var f in globals.foodList) {
    if (globals.foodList[f].overlaps(snake.head.pos)) {
      snake.eat(globals.foodList[f].power);
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
  console.log("GAME OVER");
  snake.destroy();
  snake = null;
  clearFoodList();
  console.log(globals.foodList);
}