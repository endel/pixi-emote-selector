import * as PIXI from "pixi.js";

const IS_MOBILE = /Mobi/i.test(window.navigator.userAgent);

export interface EmoteSelectorOptions {
  options?: PIXI.Sprite[],
  onItemSelected: (selectedIndex: number) => void;
}

export class EmoteSelector extends PIXI.Container {
  selectedIndex: number = -1;
  private selectedOption?: PIXI.Graphics;

  private size = 110;
  private distanceFromCenter = 40;
  private margin = 5;

  private animationTime = 100;

  private selectedAlpha = 1;
  private unselectedAlpha = 0.6;

  private lineColor = 0xffffff;
  private hoverColor = 0xffffff;
  private options: EmoteSelectorOptions;

  _show?: () => void;
  _hide?: () => void;

  constructor(opts: EmoteSelectorOptions) {
    super();

    this.options = opts;

    this.scale.set(0);

    const option1 = this.getOptionGraphics(0);
    option1.angle = -45;
    this.addChild(option1);

    const option2 = this.getOptionGraphics(1);
    option2.angle = -45;
    this.addChild(option2);

    const option3 = this.getOptionGraphics(2);
    option3.angle = -45;
    this.addChild(option3);

    const option4 = this.getOptionGraphics(3);
    option4.angle = -45;
    this.addChild(option4);

    option1.position.x -= this.size - this.distanceFromCenter + (this.margin * 2);

    option2.position.y -= this.size - this.distanceFromCenter + (this.margin * 2);
    option2.scale.x = -1;

    option3.position.y += this.size - this.distanceFromCenter + (this.margin * 2);
    option3.scale.y = -1;

    option4.position.x += this.size - this.distanceFromCenter + (this.margin * 2);
    option4.scale.set(-1);

    /**
     * CLose button
     */
    const closeButton = new PIXI.Graphics();
    this.setLineStyle(closeButton);
    closeButton.alpha = this.unselectedAlpha;
    closeButton.beginFill(0xffffff);
    closeButton.drawCircle(0, 0, this.distanceFromCenter - this.margin * 2);

    closeButton.interactive = true;
    (closeButton as PIXI.DisplayObject).on("pointerover", () => {
      // unselect previous selection
      this.clear();
      closeButton.tint = this.hoverColor;
      closeButton.alpha = this.selectedAlpha;
      this.selectedIndex = -1;
    });
    (closeButton as PIXI.DisplayObject).on("pointerout", () => {
      closeButton.tint = 0xffffff;
      closeButton.alpha = this.unselectedAlpha;
    });

    this.addChild(closeButton);

    const options = [option1, option2, option3, option4];
    if (opts.options) {
      opts.options.forEach((icon, i) => {
        const optionBackground = options[i];
        const child = this.addChild(icon);
        child.position.x = optionBackground.x - child.width / 2;
        child.position.y = optionBackground.y - child.height / 2;
      });
    }

    this.on("added", () => {
      document.addEventListener("contextmenu", this.disableContextMenu);
      // document.addEventListener("mousedown", this.onMouseDownCallback);
      document.addEventListener("mouseup", this.onMouseUpCallback);
    });

    this.on("removed", () => {
      document.removeEventListener("contextmenu", this.disableContextMenu);
      // document.removeEventListener("mousedown", this.onMouseDownCallback);
      document.removeEventListener("mouseup", this.onMouseUpCallback);
    });
  }

  clear() {
    // unselect previous selection
    if (this.selectedOption) {
      this.selectedOption.tint = 0xffffff;
      this.selectedOption.alpha = this.unselectedAlpha;
    }
  }

  setLineStyle(graphics: PIXI.Graphics) {
    graphics.lineStyle(3, this.lineColor, 1);
  }

  getOptionGraphics(index: number) {
    const option = new PIXI.Graphics();
    this.setLineStyle(option);
    option.alpha = this.unselectedAlpha;
    option.beginFill(0xffffff);
    option.moveTo(-this.distanceFromCenter, 0);
    option.lineTo(-this.size, 0);
    option.arcTo(-this.size, -this.size, 0, -this.size, this.size);
    option.lineTo(0, -this.distanceFromCenter);
    option.arcTo(-this.distanceFromCenter, -this.distanceFromCenter, -this.distanceFromCenter, 0, this.distanceFromCenter);
    this.addChild(option);
    option.position.set(0, 0);
    option.interactive = true;

    option.pivot.x = -this.size/2;
    option.pivot.y = -this.size/2;

    (option as PIXI.DisplayObject).on("pointerover", () => {
      // unselect previous selection
      this.clear();
      option.tint = this.hoverColor;
      option.alpha = this.selectedAlpha;
      this.selectedIndex = index;
      this.selectedOption = option;
    });

    (option as PIXI.DisplayObject).on("pointerout", () => {
      // option.tint = 0xffffff;
      // this.selectedIndex = -1;
    });

    return option;
  }

  destroy() {
    document.removeEventListener("contextmenu", this.disableContextMenu);
    // document.removeEventListener("mousedown", this.onMouseDownCallback);
    document.removeEventListener("mouseup", this.onMouseUpCallback);
  }

  // onMouseDownCallback = (ev: MouseEvent) => {
  //   ev.preventDefault();
  //   if (ev.button === 2) {
  //     this.open();
  //   }
  // }

  onMouseUpCallback = (ev: MouseEvent) => {
    ev.preventDefault();
    if (ev.button === 2) {
      this.close();
    }
  }

  disableContextMenu = (ev: MouseEvent) => {
    ev.preventDefault();
    this.open(ev.offsetX, ev.offsetY);
  }

  open(positionX: number, positionY: number) {
    this.scale.set(1);
    this.alpha = 1;
    this.clear();

    const ticker = PIXI.Ticker.shared;
    let initialTime: number;

    this.position.x = positionX;
    this.position.y = positionY;

    // this._show = () => {
    //   if (initialTime === undefined) {
    //     initialTime = ticker.lastTime;
    //   }

    //   const t = (ticker.lastTime - initialTime) / this.animationTime;
    //   this.scale.set(easing.expoOut(t));

    //   if (t >= 1) {
    //     ticker.remove(this._show!);
    //     this._show = undefined;
    //   }
    // };

    // ticker.add(this._show);
  }

  close() {
    const ticker = PIXI.Ticker.shared;

    this.scale.set(0);
    this.alpha = 0;

    // if (this._show) { ticker.remove(this._show) }
    // if (this._hide) { ticker.remove(this._hide) }

    if (this.selectedIndex !== -1) {
      this.options.onItemSelected(this.selectedIndex);
    }

    let initialTime: number;

    // this._hide = () => {
    //   if (initialTime === undefined) {
    //     initialTime = ticker.lastTime;
    //   }

    //   const t = (ticker.lastTime - initialTime) / (this.animationTime / 3);
    //   this.scale.set(1 - easing.expoOut(t));

    //   if (t >= 1) {
    //     console.log("REMOVE HIDE!");
    //     ticker.remove(this._hide!);
    //     this._hide = undefined;
    //   }
    // };

    // ticker.add(this._hide);
  }

}