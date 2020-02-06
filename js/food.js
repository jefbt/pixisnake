class Food {
  constructor(stage, chance = 0.1) {
    this.create(stage, chance);
  }

  create(stage, chance) {
    if (Math.random() >= chance) {
      this.timeout = (Math.random() * 6 + 4) * 1000;
      this.power = 1;
      this.shape = 0;
      this.color = defs.foodColor;
      this.size = defs.size;
      this.score = 1;
    } else {
      this.timeout = (Math.random() * 4 + 1) * 1000;
      this.power = 2;
      this.shape = 1;
      this.color = Math.random() * 255;
      this.color += Math.random() * 255 * 255;
      this.color += Math.random() * 255 * 255 * 255;
      this.size = defs.specialSize;
      this.score = 9;
    }

    this.x = Math.floor(
      (Math.random() * (globals.boundaries - defs.size)) / defs.size
    );

    this.y = Math.floor(
      (Math.random() * (globals.boundaries - defs.size)) / defs.size
    );

    const graphX = (this.x + 0.5) * defs.size;
    const graphY = (this.y + 0.5) * defs.size;

    this.graphic = new PIXI.Graphics();
    this.graphic.beginFill(this.color);
    this.graphic.lineStyle(2, 0xffffff - this.color);
    if (this.shape === 0) {
      this.graphic.drawCircle(
        graphX, graphY, this.size / 2
      );
    } else {
      this.graphic.drawStar(
        graphX, graphY, 6, this.size / 2, Math.random() * 2 * Math.PI
      );
    }
    this.graphic.endFill();

    stage.addChild(this.graphic);

    this.timeout = Date.now() + this.timeout;
  }

  overlaps(pos) {
    if (this.x === pos.x && this.y === pos.y) {
      return true;
    }
    return false;
  }

  destroy() {
    this.graphic.clear();
    this.graphic.destroy();
  }
}