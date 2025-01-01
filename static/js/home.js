import BootScene from "./scenes/BootScene.js";
import GameScene from "./scenes/GameScene.js";
import TitleScene from "./scenes/TitleScene.js";
import UiScene from "./scenes/UiScene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "phaser-game",
  scene: [BootScene, TitleScene, GameScene, UiScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: {
        y: 0,
      },
    },
  },
  pixelArt: true,
  roundPixels: true,
};

const game = new Phaser.Game(config);
