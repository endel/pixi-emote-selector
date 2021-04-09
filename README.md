# 💬😜 pixi-emote-selector

Emote Selector for [pixi.js](https://github.com/pixijs/pixi.js)

<img src="screenshot.gif?raw=1" />

## Usage

```typescript
import { EmoteSelector } from "pixi-emote-selector";

const emoteSelector = new EmoteSelector({
  options: [
    PIXI.Sprite.from('emote_exclamation'),
    PIXI.Sprite.from('emote_laugh'),
    PIXI.Sprite.from('emote_sleeps'),
    PIXI.Sprite.from('emote_heart'),
  ],
  onItemSelected: (indexSelected) => {
    console.log("Item selected:", indexSelected);
    statusText.text = `${itemSelected} selected.`;
  },
});

app.stage.addChild(emoteSelector);
```

## License

Endel Dreyer © MIT
