import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import { maxHeaderSize } from 'http';
import { EllipseCurve, RectAreaLight } from 'three';

@Injectable({
  providedIn: 'root'
})
export class P5ShaderService {
  canvas: any;

  constructor() { }

  start(): void {
    const sketch = s => {
      let simpleShader;
      s.preload = () => {
        simpleShader = s.loadShader('assets/shaders/basic.vert', 'assets/shaders/basic.frag');
      };

      s.setup = () => {
        const canvas2 = s.createCanvas(s.windowWidth - 200, s.windowHeight - 200, s.WEBGL);
        canvas2.parent('sketch-holder');
        s.noStroke();
      };

      s.draw = () => {
        s.shader(simpleShader);
        s.rect(0, 0, s.width, s.height);
      };

      // s.windowResized = () => {
      //   s.resizeCanvas(s.windowWidth, s.windowHeight);
      // };
    };

    this.canvas = new p5(sketch);
  }
}
