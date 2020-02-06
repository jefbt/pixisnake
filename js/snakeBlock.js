class SnakeBlock {
  constructor(stage, pos, follow, isHead = false) {
    this.create(stage, pos, follow, isHead);
  }

  create(stage, pos, follow, isHead) {
    this.pos = {
      x: pos.x,
      y: pos.y
    }
    this.follow = follow;
    this.next = null;
    this.wait = true;

    this.graphic = new PIXI.Graphics();
    this.updateGraphic(isHead);

    stage.addChild(this.graphic);
  }

  move() {
    if (this.wait) {
      this.wait = false;
      return;
    }

    if (this.follow) {
      this.pos.x = this.follow.pos.x;
      this.pos.y = this.follow.pos.y;
      
    } else {
      switch(this.direction) {
        case 0: this.pos.y--; break;
        case 1: this.pos.y++; break;
        case 2: this.pos.x--; break;
        case 3: this.pos.x++; break;
      }
    }
    if (this.pos.y < 0) {
      this.pos.y = 25;
    }
  }

  updateGraphic(isHead = false) {
    this.graphic.clear();
    if (!isHead) {
      this.graphic.beginFill(defs.snakeColor);
      this.graphic.lineStyle(2, defs.snakeLine);
    } else {
      this.graphic.beginFill(defs.snakeLine);
      this.graphic.lineStyle(2, defs.snakeColor);
    }
    this.graphic.drawRect(
      this.pos.x * defs.size,
      this.pos.y * defs.size,
      defs.size, defs.size
    );
    this.graphic.endFill();
  }

  destroy() {
    this.graphic.destroy();
    this.graphic = null;
    this.pos = null;
    this.follow = null;
    this.next = null;
  }
}