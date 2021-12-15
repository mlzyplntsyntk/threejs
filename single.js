import "./style.css";

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SplineCurve } from "three";

let mixer;

const loadAnimatedModel = (scene) => {
  const loader = new FBXLoader();
  loader.setPath("./dls/amy/");
  loader.load("Ch46_nonPBR.fbx", (fbx) => {
    fbx.scale.setScalar(0.1);
    fbx.traverse((c) => {
      c.castShadow = true;
    });
    const anim = new FBXLoader();
    anim.setPath("./dls/amy/");
    anim.load("Ch46_ump.fbx", (anim) => {
      mixer = new THREE.AnimationMixer(fbx);
      const idle = mixer.clipAction(anim.animations[0]);
      idle.play();
    });
    scene.add(fbx);
  });
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setY(15);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff64367,
//   wireframe: true,
// });
const material = new THREE.MeshStandardMaterial({ color: 0xff64367 });
const torus = new THREE.Mesh(geometry, material);
torus.position.setX(-30);
scene.add(torus);

// const pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(20, 20, 20);
// scene.add(pointLight);

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
scene.add(light);

const lightHelper = new THREE.PointLightHelper(light);
scene.add(lightHelper);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100, 1, 1),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
  })
);
plane.castShadow = false;
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

loadAnimatedModel(scene);

// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelper);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

let previousRAF = null;

function animate() {
  requestAnimationFrame(animate);

  if (typeof mixer !== "undefined") {
    mixer.update(0.01);
  }

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
