import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Character from "./character";

class App {
  constructor() {
    this._init();
  }

  _init() {
    this._engine = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._engine.outputEncoding = THREE.sRGBEncoding;
    this._engine.shadowMap.enabled = true;
    this._engine.setPixelRatio(window.devicePixelRatio);
    this._engine.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._engine.domElement);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;

    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(25, 10, 25);

    this._scene = new THREE.Scene();

    const gridHelper = new THREE.GridHelper(200, 50);
    this._scene.add(gridHelper);

    const controls = new OrbitControls(this._camera, this._engine.domElement);
    controls.target.set(0, 10, 0);
    controls.update();

    this.addLights();
    this.addPlane();

    const params = {
      camera: this._camera,
      scene: this._scene,
      name: "amy",
    };
    this._mixers = [];
    this._character = new Character(params);

    this._previousFrame = null;
    this._advance();
  }

  addLights() {
    let light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(-100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 50;
    light.shadow.camera.right = -50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;
    this._scene.add(light);

    light = new THREE.AmbientLight(0xffffff, 0.25);
    this._scene.add(light);
  }

  addPlane() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x808080,
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);
  }

  _advance() {
    requestAnimationFrame((t) => {
      if (this._previousFrame === null) {
        this._previousFrame = t;
      }

      this._advance();

      this._engine.render(this._scene, this._camera);
      this._step(t - this._previousFrame);
      this._previousFrame = t;
    });
  }

  _step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this._mixers) {
      this._mixers.map((m) => m.update(timeElapsedS));
    }

    if (this._character) {
      this._character.Update(timeElapsedS);
    }
  }
}

export default App;
