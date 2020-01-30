// Thanks to https://stackoverflow.com/questions/49472433/how-to-use-p5-js-in-angular-5-application/53464162

import { Component, OnInit } from '@angular/core';

import { ProcessingService } from '../../services/processing.service';
import { P5ShaderService } from 'src/app/services/p5-shader.service';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.scss']
})
export class ProcessingComponent implements OnInit {

  // inside constructor: private processingService: ProcessingService
  constructor( private p5ShaderService: P5ShaderService ) { }

  ngOnInit() {
    this.p5ShaderService.start();
  }

}
