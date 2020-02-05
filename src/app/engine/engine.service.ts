import * as THREE from 'three';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
//import { OrbitControls } from 'three/examples/js/controls/OrbitControls';
import { OrbitControls } from '@avatsaev/three-orbitcontrols-ts';
import { GeometryUtils } from 'three';

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
    //this.loadObj('/assets/models/texturedMesh.obj');
    this.crearCubo();
    this.loadGltf('/assets/scene.gltf');
    //this.crearFireTorus();
    //this.crearPantalla();

    // ponemos el orbitControls
    let controls = new OrbitControls(this.camera, this.renderer.domElement);

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

    //this.cube.rotation.x += 0.01;
    //this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }

  // ------METODOS CREADOS PARA ORDENAR CODIGO ---------

  crearPantalla(): void {
    // https://threejs.org/docs/#api/en/core/BufferGeometry
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
      -1.0, -1.0, 1.0,
      1.0, -1.0,  1.0,
      1.0,  1.0,  1.0,

      1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0, -1.0,  1.0
    ]);
    geometry.setAttribute( 'aPosition', new
      THREE.BufferAttribute( vertices, 3 ) );

    // https://threejs.org/docs/#api/en/materials/ShaderMaterial
    // https://github.com/mrdoob/three.js/blob/master/examples/webgl_shader2.html
    const vertexShader = `
      attribute vec3 aPosition;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( aPosition, 1.0 );
				gl_Position = projectionMatrix * mvPosition;
      }
    `;
    const fragmentShader = `
      precision mediump float;
      varying vec2 vTextCoord;
      void main() {
        vec2 coord = vTexCoord;
        gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0);
      }
    `;
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    const pantalla = new THREE.Mesh( geometry, material );
    this.scene.add(pantalla);
  }

  crearFireTorus() {
    var textureLoader = new THREE.TextureLoader();
    var uniforms = {
      'fogDensity': { value: 0.45},
      'fogColor': { value: new THREE.Vector3( 0, 0, 0 ) },
      'time': { value: 1.0 },
      'uvScale': { value: new THREE.Vector2( 3.0, 1.0 ) },
      'texture1': { value: textureLoader.load( 'assets/textures/lava/cloud.png') },
      'texture2': { value: textureLoader.load( 'assets/textures/lava/lavatile.jpg') }
    };

    uniforms[ 'texture1' ].value.wrapS = uniforms[ 'texture1' ].value.wrapT = THREE.RepeatWrapping;
    uniforms[ 'texture2' ].value.wrapS = uniforms[ 'texture2' ].value.wrapT = THREE.RepeatWrapping;

    var size = 0.65;
    var material = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: this.createVertexShaderFireTorus(),
      fragmentShader: this.createFragmentShaderFireTorus()
    });
    const mesh = new THREE.Mesh( new THREE.TorusBufferGeometry(size, 0.3, 30, 30), material);
    mesh.rotation.x = 0.3;
    mesh.position.x = 0;
    mesh.position.y = 1;
    mesh.position.z = -0;
    this.scene.add(mesh);
  }

  createVertexShaderFireTorus(): string {
    const vertexShader = `
    uniform vec2 uvScale;
			varying vec2 vUv;

			void main()
			{

				vUv = uvScale * uv;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_Position = projectionMatrix * mvPosition;

			}
    `;
    return vertexShader;
  }

  createFragmentShaderFireTorus(): string {
    const fragmentShader = `
    uniform float time;

			uniform float fogDensity;
			uniform vec3 fogColor;

			uniform sampler2D texture1;
			uniform sampler2D texture2;

			varying vec2 vUv;

			void main( void ) {

				vec2 position = - 1.0 + 2.0 * vUv;

				vec4 noise = texture2D( texture1, vUv );
				vec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;
				vec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;

				T1.x += noise.x * 2.0;
				T1.y += noise.y * 2.0;
				T2.x -= noise.y * 0.2;
				T2.y += noise.z * 0.2;

				float p = texture2D( texture1, T1 * 2.0 ).a;

				vec4 color = texture2D( texture2, T2 * 2.0 );
				vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );

				if( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
				if( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }
				if( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }

				gl_FragColor = temp;

				float depth = gl_FragCoord.z / gl_FragCoord.w;
				const float LOG2 = 1.442695;
				float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
				fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );

				gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

			}
    `;
    return fragmentShader;
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

  loadObj(path: string): void {
    const loader = new OBJLoader();
    loader.load(path, function(object) {
      addObjToScene(object);
    });
    var addObjToScene = (object) => this.scene.add(object);
  }

}



//https://github.com/nicolaspanel/three-orbitcontrols-ts