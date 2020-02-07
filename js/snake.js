class Snake {
  constructor(stage, pos, gameOver) {
    this.create(stage, pos, gameOver);
  }

  create(stage, pos, gameOver) {
    this.head = new SnakeBlock(stage, pos, null, true);
    this.head.direction = 0;
    this.size = 1;
    this.head.id = this.size;
    this.grow = 0;
    this.tail = this.head;
    this.stage = stage;
    this.head.wait = false;
    this.lastDirection = this.head.direction;
    this.gameOver = gameOver;
  }

  destroy() {
    let pointer = this.tail;
    let destroyList = []
    while(pointer) {
      destroyList.push(pointer);
      pointer = pointer.follow;
    }
    while(destroyList.length > 0) {
      destroyList.pop().destroy();
    }
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.grow = 0;
    this.stage = null;
  }

  update() {
    if (this.grow > 0) {
      this.grow--;
      this.increase();
    }

    const reachBoundaries = this.move();
    if (reachBoundaries) {
      this.adjust();
      return true;
    }
    return false;
  }

  move() {
    let newX = this.head.pos.x;
    let newY = this.head.pos.y;
    switch(this.head.direction) {
      case 0: newY--; break;
      case 1: newY++; break;
      case 2: newX--; break;
      case 3: newX++; break;
    }

    this.verifySelfCollision(newX, newY);

    newX *= defs.size;
    newY *= defs.size;

    if (newX > globals.boundaries - defs.size ||
        newY > globals.boundaries - defs.size ||
        newX < 0 || newY < 0)
    {
      return true;
    }

    let pointer = this.tail;
    while (pointer) {
      pointer.move();
      pointer.updateGraphic();
      pointer = pointer.follow;
    }
    this.head.updateGraphic(true);

    this.lastDirection = this.head.direction;

    return false;
  }

  turn(direction) {
    if (this.size > 1) {
      const invertDir = this.invertDirection(direction);
      if (invertDir !== this.lastDirection) {
        this.head.direction = direction;
      }
    } else {
      this.head.direction = direction;
    }
  }

  verifySelfCollision(x, y) {
    let pointer = this.head.next;
    while(pointer) {
      if (x === pointer.pos.x && y === pointer.pos.y) {
        this.gameOver();
      }
      pointer = pointer.next;
    }
  }

  invertDirection(d) {
    switch(d) {
      case 0: return 1;
      case 1: return 0;
      case 2: return 3;
      case 3: return 2;
    }
  }

  eat(power) {
    this.grow += power;
  }

  increase() {
    let last = this.tail;
    let newBlock = new SnakeBlock(
      this.stage, last.pos, last
    );
    newBlock.id = this.size + 1;
    last.next = newBlock;
    this.tail = newBlock;
    this.size++;
  }

  invert() {
    let pointer = this.head;
    const first = this.head;
    
    const newDirection =
      this.invertDirection(this.head.direction);

    this.head = this.tail;
    this.tail = first;
    
    while(pointer) {
      let follow = pointer.follow;
      let next = pointer.next;
      pointer.follow = next;
      pointer.next = follow;
      pointer.updateGraphic();
      pointer = next;
    }

    this.head.updateGraphic(true);
    this.head.direction = newDirection;
    
    this.head.follow = null;
    this.tail.next = null;
  }

  adjust() {
    this.invert();

    let newX = this.head.pos.x * defs.size;
    let newY = this.head.pos.y * defs.size;

    if (newX < 0) {
      newX = 0;
    } else if (newX > globals.boundaries - defs.size - defs.shrinkScreen) {
      newX = globals.boundaries - defs.size - defs.shrinkScreen;
    }
    if (newY < 0) {
      newY = 0;
    } else if (newY > globals.boundaries - defs.size - defs.shrinkScreen) {
      newY = globals.boundaries - defs.size - defs.shrinkScreen;
    }
    newX = Math.floor(newX / defs.size);
    newY = Math.floor(newY / defs.size);

    let adjustX = newX - this.head.pos.x;
    let adjustY = newY - this.head.pos.y;

    this.head.pos.x = newX;
    this.head.pos.y = newY;

    let pointer = this.head.next;
    while(pointer) {
      pointer.pos.x -= adjustX;
      pointer.pos.y -= adjustY;
      pointer.updateGraphic();
      pointer = pointer.next;
    }
    this.head.updateGraphic(true);
  }
}