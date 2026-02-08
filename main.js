import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. --- CONFIGURATION ---
// IMPORTANT: Ensure this filename is exactly what you have in your folder
const MODEL_PATH = 'my_model.glb'; 

// 2. --- SCENE SETUP ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Light blue sky color

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// 3. --- FALLBACK FUNCTION ---
function spawnCapsule() {
    console.warn("Switching to capsule fallback...");
    const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0055 });
    const capsule = new THREE.Mesh(geometry, material);
    capsule.position.y = 1; 
    scene.add(capsule);
    document.getElementById('status').innerText = "Model Failed: Capsule Loaded";
}

// 4. --- LOAD LOGIC ---
const isGLB = MODEL_PATH.toLowerCase().endsWith('.glb') || MODEL_PATH.toLowerCase().endsWith('.gltf');
const loader = isGLB ? new GLTFLoader() : new FBXLoader();

loader.load(
    MODEL_PATH,
    (result) => {
        const model = isGLB ? result.scene : result;
        scene.add(model);
        document.getElementById('status').innerText = "Model Loaded!";
    },
    undefined, // Progress callback
    (err) => {
        console.error("Loader Error:", err);
        spawnCapsule(); // This triggers if the file is missing or broken
    }
);

// 5. --- ANIMATION ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
