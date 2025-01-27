import * as THREE from "three";
import "./style.css";
import gsap from "gsap";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import { MTLLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

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
mtlLoader.load("cubo.mtl", function (material) {
  material.preload();

  var objLoader = new OBJLoader();
  objLoader.setMaterials(material);
  objLoader.setPath("models/");
  objLoader.load(
    "headComp.obj",
    function (object) {
      head = object;
      head.scale.set(1, 1, 1);
      head.rotation.set(-90, 0, 0);
      head.position.set(0, 0, 0);
      head.visible = true;
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

const pointLight = new THREE.PointLight(0xffcc00, 250, 100);
pointLight.position.set(10, 10, 10);
const pointLightBack = new THREE.PointLight(0xffcc00, 250, 100);
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
controls.autoRotateSpeed = 7;

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

// get cube, sphere and head nav items and add event listeners
const cubeNav = document.querySelector(".cube");
const sphereNav = document.querySelector(".sphere");
const headNav = document.querySelector(".head");
const title = document.querySelector(".title");

cubeNav.addEventListener("click", () => {
  scene.remove(sphere);
  scene.remove(head);
  scene.add(cube);
  scene.remove(pointLight);
  scene.remove(pointLightBack);

  gsap.to(cube.rotation, { duration: 1, x: 0, y: 0, z: 0 });
  animateObject(cube, 0.5, 1);

  cubeNav.classList.add("active");
  sphereNav.classList.remove("active");
  headNav.classList.remove("active");
  //change title text
  title.innerHTML = "Kube West";
});

sphereNav.addEventListener("click", () => {
  scene.remove(cube);
  scene.remove(head);
  scene.add(sphere);
  scene.remove(pointLight);
  scene.remove(pointLightBack);

  gsap.to(sphere.rotation, { duration: 1, x: 0, y: 0, z: 0 });
  animateObject(sphere, 0.5, 1);

  sphereNav.classList.add("active");
  cubeNav.classList.remove("active");
  headNav.classList.remove("active");

  title.innerHTML = "Tyler, The Sphere";
});

headNav.addEventListener("click", () => {
  scene.remove(cube);
  scene.remove(sphere);
  scene.add(head);
  scene.add(pointLight);
  scene.add(pointLightBack);

  gsap.to(head.rotation, { duration: 1, x: -90, y: 0, z: 0 });
  animateObject(head, 0.5, 1);

  headNav.classList.add("active");
  cubeNav.classList.remove("active");
  sphereNav.classList.remove("active");

  title.innerHTML = "The Head";
});

const loadingStage = document.querySelector(".loading-stage");

function hideLoadingStage() {
  loadingStage.style.display = "none";
}

function showLoadingStage() {
  loadingStage.style.display = "flex";
}

showLoadingStage();
