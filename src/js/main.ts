import * as PIXI from 'pixi.js'
import Map from './map';

const scene = document.querySelector('#scene') as HTMLCanvasElement;
const width = 60;
const column = 5;
const row = 5;
scene.style.marginLeft = -(column * width * window.devicePixelRatio / 2) + 'px'
scene.style.marginTop = -(row * width * window.devicePixelRatio / 2) + 'px'
const app = new PIXI.Application({
  width: column * width,
  height: row * width,
  backgroundColor: 0x101010,
  view: scene,
  resolution: window.devicePixelRatio || 1
});
const map = new Map({
  app,
  row,
  column
});
map.init();
map.draw();