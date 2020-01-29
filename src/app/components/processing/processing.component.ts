// Thanks to https://stackoverflow.com/questions/49472433/how-to-use-p5-js-in-angular-5-application/53464162

import { Component, OnInit } from '@angular/core';

import { ProcessingService } from '../../services/processing.service';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.scss']
})
export class ProcessingComponent implements OnInit {

  constructor(private processingService: ProcessingService) { }

  ngOnInit() {
    
    this.processingService.start();
    //this.createCanvas();
  }

  // private createCanvas(): void {
  //   this.p5 = new P5(this.sketch);
  // }

  // private sketch(p: any) {
  //   p.setup = () => {
  //     p.createCanvas(700, 600);
  //   };

  //   p.draw = () => {
  //     p.background(255);
  //     p.fill(0);
  //     p.rect(p.width / 2, p.height / 2, 50, 50);
  //   };
  // }

}
