import * as PIXI from 'pixi.js'
import Eliminate from './eliminate';

interface MapOptions {
    app: PIXI.Application;
    row: number;
    column: number;
    width?: number;
};

const random = (n: number) => Math.floor(Math.random() * n);
let points:Array<number[]> = [];
let sprites:Array<PIXI.Sprite> = [];

export default class Map {

    arr: Array<Array<number | undefined>>;
    currentTotal: number;
    eliminateCount: number;
    options: MapOptions;

    constructor(options: MapOptions) {
        this.options = options;
        this.currentTotal = 0;
        this.eliminateCount = 0;
        this.arr
         = [];
    }

    init() {
        const { row, column } = this.options;
        const arr = [];
        const total = row * column;
        const currentTotal = total % 2 === 0 ? total : (total - 1);
        const length = currentTotal / 2

        for (let i = 0; i < length; i++) {
            const randomIndex = random(6);
            arr[i] = randomIndex;
            arr[total- (i + 1)] = randomIndex;
        }

        for (let i = 0; i < 100; i++) {
            const index1 = random(total);
            const index2 = random(total);

            if (total % 2 !== 0 && (index1 === length || index2 === length)) continue;

            [arr[index1] , arr[index2]] = [arr[index2], arr[index1]];
        }

        let index = 0;
        for (let j = 0; j < row; j++) {
            for (let i = 0; i < column; i++) {
              const number = arr[index];
              if (!this.arr[j]) this.arr[j] = [];
              this.arr[j][i] = number;
              index++;
            }
        }

        this.currentTotal = currentTotal;
        Eliminate.arr = this.arr;
    }

    draw() {
        const { app, row, column, width = 60 } = this.options;
        const { arr } = this;

        let index = 0;
        for (let j = 0; j < row; j++) {
          for (let i = 0; i < column; i++) {
            const number = arr[j][i];
            const texture = PIXI.Texture.from(`assets/${number}.png`);
            const bunny = new PIXI.Sprite(texture);
            bunny.width = width;
            bunny.height = width;
            bunny.x = width * i;
            bunny.y = width * j;
            bunny.interactive = true;

            const event = () => {
                if (!bunny.visible) return;
                if (points.length === 1) {
                    const x1 = points[0][0];
                    const y1 = points[0][1];
                    if (Eliminate.remove(x1, y1, i, j)) {
                        this.arr[y1][x1] = undefined;
                        this.arr[j][i] = undefined;
                        sprites[0].visible = false;
                        bunny.visible = false;
                        Eliminate.arr = this.arr;
                        
                        this.eliminateCount += 2;
                        if (this.eliminateCount === this.currentTotal) {
                            (document.getElementById('success') as HTMLAudioElement).play();
                        } else {
                            (document.getElementById('yes') as HTMLAudioElement).play();
                        }
                    }
                    points = [];
                    sprites[0].alpha = 1;
                    sprites = [];
                    return;
                }

                points.push([i, j])
                bunny.alpha = 0.5;
                sprites.push(bunny);
            };

            bunny.on('click', event);
            bunny.on('tap', event);
            app.stage.addChild(bunny);
            index++;
          }
        }
    }

}