import * as THREE from "three";
import "./style.css";
import gsap from "gsap";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import { MTLLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { FlyControls } from "three/examples/jsm/Addons.js";

const loadingStage = document.querySelector(".loading-stage");

function hideLoadingStage() {
  loadingStage.style.display = "none";
}

function showLoadingStage() {
  loadingStage.style.display = "flex";
}

showLoadingStage();

//scene
const scene = new THREE.Scene();

//Create our cube
const cubeTexture = new THREE.TextureLoader().load("textures/can-ye.jpg");
cubeTexture.colorSpace = THREE.SRGBColorSpace;
const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshStandardMaterial({
  map: cubeTexture,
  roughness: 0.5,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

//create a sphere
const sphereTexture = new THREE.TextureLoader().load("textures/tyler.jpg");
sphereTexture.colorSpace = THREE.SRGBColorSpace;
const SphereGeometry = new THREE.SphereGeometry(3, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  map: sphereTexture,
  roughness: 0.3,
});
const sphere = new THREE.Mesh(SphereGeometry, sphereMaterial);

// create a head
let head = null;
const mtlLoader = new MTLLoader();
mtlLoader.setPath("models/");
mtlLoader.load("headCompMesh.mtl", function (material) {
  material.preload();

  var objLoader = new OBJLoader();
  objLoader.setMaterials(material);
  objLoader.setPath("models/");
  objLoader.load(
    "headCompMesh.obj",
    function (object) {
      head = object;
      head.scale.set(1, 1, 1);
      head.rotation.set(4.7, 0, 0);
      head.position.set(0, 0, 0);
      head.visible = true;
      // scene.add(head);
    },
    function (xhr) {
      const percentLoaded = (xhr.loaded / xhr.total) * 100;
      document.querySelector(
        ".progress-text"
      ).textContent = `Loading... ${percentLoaded.toFixed(2)}%`;
    },
    function (error) {
      console.error("Erro ao carregar o modelo: ", error);
    }
  );
});

// create a body
let body = null;
const bodyMtlLoader = new MTLLoader();
bodyMtlLoader.setPath("models/");
bodyMtlLoader.load("chestComp.mtl", function (material) {
  material.preload();

  var bodyObjLoader = new OBJLoader();
  bodyObjLoader.setMaterials(material);
  bodyObjLoader.setPath("models/");
  bodyObjLoader.load(
    "chestComp.obj",
    function (object) {
      body = object;
      body.scale.set(1, 1, 1);
      body.rotation.set(4.7, 0, 0);
      body.position.set(0, 0, 0);
      body.visible = true;
      // scene.add(head);
      hideLoadingStage();
    },
    function (xhr) {
      const percentLoaded = (xhr.loaded / xhr.total) * 100;
      document.querySelector(
        ".progress-text"
      ).textContent = `Loading... ${percentLoaded.toFixed(2)}%`;
    },
    function (error) {
      console.error("Erro ao carregar o modelo: ", error);
    }
  );
});

//Light
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const pointLight = new THREE.PointLight(0xffdd55, 300, 100);
pointLight.position.set(10, 10, 10);
const pointLightBack = new THREE.PointLight(0xffdd55, 300, 100);
pointLightBack.position.set(-10, -10, -10);
// scene.add(pointLight);

//camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight
);
camera.position.z = 20;
scene.add(camera);

//renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

//Resize
window.addEventListener("resize", () => {
  //update sizes
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  //update camera
  camera.updateProjectionMatrix();

  //update renderer
  renderer.render(scene, camera);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

//timeline magiccc
const animateNav = (duration) => {
  const tl = gsap.timeline({ defaults: { duration: duration } });
  tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
};

const animateObject = (object, duration, scale) => {
  const tl = gsap.timeline({ defaults: { duration: duration } });
  tl.fromTo(
    object.scale,
    { z: 0, x: 0, y: 0 },
    { z: scale, x: scale, y: scale }
  );
  tl.fromTo(".title", { opacity: 0 }, { opacity: 1 }, "<50%");
};

animateNav(1);
animateObject(cube, 1, 1);

const addToScene = (object) => {
  scene.remove(cube);
  scene.remove(sphere);
  scene.remove(head);
  scene.remove(body);
  scene.add(object);
};

// get cube, sphere and head nav items and add event listeners
const cubeNav = document.querySelector(".cube");
const sphereNav = document.querySelector(".sphere");
const headNav = document.querySelector(".head");
const bodyNav = document.querySelector(".body");
const title = document.querySelector(".title");

cubeNav.addEventListener("click", () => {
  addToScene(cube);
  scene.remove(pointLight);
  scene.remove(pointLightBack);

  animateObject(cube, 0.5, 1);

  cubeNav.classList.add("active");
  sphereNav.classList.remove("active");
  headNav.classList.remove("active");
  bodyNav.classList.remove("active");
  //change title text
  title.innerHTML = "Kube West";
});

sphereNav.addEventListener("click", () => {
  addToScene(sphere);
  scene.remove(pointLight);
  scene.remove(pointLightBack);

  animateObject(sphere, 0.5, 1);

  sphereNav.classList.add("active");
  cubeNav.classList.remove("active");
  headNav.classList.remove("active");
  bodyNav.classList.remove("active");

  title.innerHTML = "Tyler, The Sphere";
});

headNav.addEventListener("click", () => {
  addToScene(head);
  scene.add(pointLight);
  scene.add(pointLightBack);

  animateObject(head, 0.5, 1);

  headNav.classList.add("active");
  cubeNav.classList.remove("active");
  sphereNav.classList.remove("active");
  bodyNav.classList.remove("active");

  title.innerHTML = "The Head";
});

bodyNav.addEventListener("click", () => {
  addToScene(body);
  scene.add(pointLight);
  scene.add(pointLightBack);

  animateObject(body, 0.5, 1);

  bodyNav.classList.add("active");
  cubeNav.classList.remove("active");
  sphereNav.classList.remove("active");
  headNav.classList.remove("active");

  title.innerHTML = "The Body";
});
