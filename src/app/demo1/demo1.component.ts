import { Component, OnInit } from '@angular/core';
import { EngineService } from '../engine/engine.service';
import * as THREE from 'three';

@Component({
  selector: 'app-demo1',
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.scss']
})
export class Demo1Component implements OnInit {

  private cube: THREE.Mesh;

  constructor(private engServ: EngineService) { }

  ngOnInit() {
    this.dibujar();
  }

  dibujar() {
    const geometry = new THREE.BoxGeometry(3, 1, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh( geometry, material );
    this.engServ.scene.add(this.cube);
  }

}
