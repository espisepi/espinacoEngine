import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { EngineNebulaCloud } from './engineNebulaCloud';

@Component({
  selector: 'app-nebula-cloud',
  templateUrl: './nebula-cloud.component.html',
  styleUrls: ['./nebula-cloud.component.scss']
})
export class NebulaCloudComponent implements OnInit {

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private engNebulaCloud: EngineNebulaCloud) { }

  ngOnInit() {
    this.engNebulaCloud.createScene(this.rendererCanvas);
    this.engNebulaCloud.animate();
  }

}
