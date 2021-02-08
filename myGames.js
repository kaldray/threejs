import * as THREE from "./node_modules/three/build/three.module.js";
import { GLTFLoader } from "./gltfLoarders.js";

const scene = new THREE.Scene();
const loader = new GLTFLoader();
const light = new THREE.AmbientLight(0xffffff, 1);
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(50, aspect, 1, 5000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
let meshs = [];

let geometrie = new THREE.SphereBufferGeometry();
geometrie.computeBoundingBox();
let material = new THREE.MeshBasicMaterial({ color: "black" });
let mesh_avion = new THREE.Mesh(geometrie, material);
mesh_avion.position.set(0, 0, 0);
const text_load = new THREE.TextureLoader();
const texture = text_load.load("./astero.jpg");

// Initialisation

let chargement = document.querySelector("#chargement");
let container = document.querySelector("#container");


// canvas.textContent = 'point'

chargement.addEventListener("click", () => {
  init();
  chargement.remove();
  container.remove();
});
function init() {
  scene.add(light);
  camera.position.set(0, 0, 500);
  camera.lookAt(mesh_avion.position);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // attacher le rendu au DOM
  generateObject();
  document.body.appendChild(renderer.domElement);
}

const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", onResize);
// animation 60fps
function render() {
  meshs.forEach((m) => {
    m.position.z += 1;
    if (m.position.z > 500) {
      m.position.z = -500;
      m.position.y = getRandomInt(0, 500) - 250;
      m.position.x = getRandomInt(0, 500) - 250;
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

// Avion gltf loarder
loader.load(
  "./Avion.gltf",
  (gltf) => {
    let mesh_avion = gltf.scene;
    mesh_avion.scale.set(0.3, 0.3, 0.3);
    mesh_avion.rotation.set(0, 3.14159265, 0);

    scene.add(mesh_avion);
    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
      let keyCode = event.which;
      if (keyCode == 38) {
        // haut
        mesh_avion.position.y += 10;
      } else if (keyCode == 40) {
        // bas
        mesh_avion.position.y -= 10;
      } else if (keyCode == 39) {
        // gauche
        mesh_avion.position.x += 10;
      } else if (keyCode == 37) {
        // droite
        mesh_avion.position.x -= 10;
      } else if (keyCode == 38 && keyCode == 37) {
        // haut droite
        mesh_avion.position.x += 10;
        mesh_avion.position.y += 10;
      } else if (keyCode == 38 && keyCode == 39) {
        // haut gauche
        mesh_avion.position.x -= 10;
        mesh_avion.position.y += 10;
      } else if (keyCode == 40 && keyCode == 39) {
        // bas gauche
        mesh_avion.position.x -= 10;
        mesh_avion.position.y -= 10;
      } else if (keyCode == 40 && keyCode == 37) {
        // bas droite
        mesh_avion.position.x += 10;
        mesh_avion.position.y -= 10;
      }
      if (mesh_avion.position.x > 390) mesh_avion.position.x += -10;
      if (mesh_avion.position.x < -390) mesh_avion.position.x += 10;
      if (mesh_avion.position.y > 190) mesh_avion.position.y += -10;
      if (mesh_avion.position.y < -190) mesh.position.y += 10;
    }
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "%");
  },
  (error) => {
    console.log("An error happened");
  }
);

// nombre aleatoire
function getRandomInt(min, max) {
  return Math.random() * (max - min + 1) + min;
}

// Génération des météores
function generateObject() {
  for (let i = 0; i < 15; i++) {
    let geom = new THREE.SphereBufferGeometry(getRandomInt(10, 25));
    const mat = new THREE.MeshBasicMaterial({ color: "violet", map: texture });
    const mesh = new THREE.Mesh(geom, mat);
    geom.computeBoundingBox();
    mesh.position.set(
      getRandomInt(0, 500) - 250,
      getRandomInt(0, 500) - 250,
      -500
    );
    scene.add(mesh);
    meshs.push(mesh);
  }
  render();
}


requestAnimationFrame(render);
