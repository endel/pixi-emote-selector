declare var require: any; // parcel/typescript workaround.

import * as PIXI from "pixi.js"; // -legacy
import { EmoteSelector } from "../src/";

// Pixel-art friendly
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
PIXI.settings.ROUND_PIXELS = true;
PIXI.settings.RESOLUTION = window.devicePixelRatio;

PIXI.Loader.shared
  .add('balloon', require("./images/balloon.png")) 
  .add('emote_exclamation', require("./images/emote_exclamation.png")) 
  .add('emote_heart', require("./images/emote_heart.png")) 
  .add('emote_laugh', require("./images/emote_laugh.png")) 
  .add('emote_sleeps', require("./images/emote_sleeps.png")) 
  .load(initialize);

function initialize() {
  const app = new PIXI.Application({
    view: document.getElementById('canvas') as HTMLCanvasElement,
    backgroundColor: 0x444444,
    autoDensity: true,
    resolution: window.devicePixelRatio,
  });

  const statusText = new PIXI.Text("[status]");
  statusText.position.set(8, 8);
  app.stage.addChild(statusText);

  const options = [
    PIXI.Sprite.from('emote_exclamation'),
    PIXI.Sprite.from('emote_laugh'),
    PIXI.Sprite.from('emote_sleeps'),
    PIXI.Sprite.from('emote_heart'),
  ];
  options.forEach(option => option.scale.set(3));

  const mobileButton = PIXI.Sprite.from('balloon');
  mobileButton.scale.set(3);

  const emoteSelector = new EmoteSelector({
    options,
    mobileButton,
    onItemSelected: (itemSelected) => {
      statusText.text = `${itemSelected} selected.`;
    },
  });
  emoteSelector.position.x = window.innerWidth / 2;
  emoteSelector.position.y = window.innerHeight / 2;

  app.stage.addChild(emoteSelector);

  const resize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.resize();
  }
  resize();
  window.addEventListener('resize', resize);

  app.start();
}