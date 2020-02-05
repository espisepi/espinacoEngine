import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import * as THREE from 'three';

@Injectable({
    providedIn: 'root'
  })
  export class EngineNebulaCloud implements OnDestroy {

    public canvas: HTMLCanvasElement;
    public renderer: THREE.WebGLRenderer;
    public camera: THREE.PerspectiveCamera;
    public scene: THREE.Scene;

    public frameId: number = null;

    public constructor(private ngZone: NgZone) {}

    public ngOnDestroy() {
        if (this.frameId != null) {
            cancelAnimationFrame(this.frameId);
        }
    }

    createScene(canvas: ElementRef<HTMLCanvasElement>): void {
        this.canvas = canvas.nativeElement;
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene = new THREE.Scene();
        this.crearCamara();
        this.crearCubo();
    }

    crearCamara(): void {
        this.camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        this.camera.position.z = 5;
        this.scene.add(this.camera);
    }

    crearCubo(): void {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh( geometry, material );
        cube.name = 'cubo1';
        this.scene.add(cube);
    }

    animate(): void {
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

    render(): void {
        this.frameId = requestAnimationFrame(() => {
            this.render();
        });
        const cube = this.scene.getObjectByName('cubo1');
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
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