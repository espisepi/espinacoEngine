import * as THREE from 'three';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//import { OrbitControls } from 'three/examples/js/controls/OrbitControls';
import { OrbitControls } from '@avatsaev/three-orbitcontrols-ts';

@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  public canvas: HTMLCanvasElement;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public light: THREE.AmbientLight;

  public scenes: Array<THREE.Scene>;

  public cube: THREE.Mesh;

  public frameId: number = null;

  public constructor(private ngZone: NgZone) {}

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.crearCamara();
    this.crearLuzAmbiental();
    this.crearCubo();
    this.loadGltf('/assets/scene.gltf');

    // ponemos el orbitControls
    let controls = new OrbitControls(this.camera, this.renderer.domElement);

  }

  crearCamara(): void {
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);
  }

  // soft white light
  crearLuzAmbiental(): void {
    this.light = new THREE.AmbientLight( 0x404040 );
    this.light.position.z = 10;
    this.scene.add(this.light);
  }

  crearCubo(): void {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add(this.cube);
  }

  loadGltf(path: string): void {
    const loader = new GLTFLoader();
    loader.load(path, function(gltf) {
      const gltfReal = gltf.scene.children[0];
      // castillo.scale.set(0.9, 0.9, 0.9);
      addGltfToScene(gltfReal);
    });
    var addGltfToScene = (gltfReal) => this.scene.add(gltfReal);
  }

  animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }
}



//https://github.com/nicolaspanel/three-orbitcontrols-ts