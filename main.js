import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- CONFIGURATION ---
const MODEL_PATH = 'path/to/your/model.glb'; // Change to .fbx or .glb
const IS_GLB = MODEL_PATH.endsWith('.glb') || MODEL_PATH.endsWith('.gltf');

// --- SCENE SETUP ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
scene.add(light);

// --- FALLBACK: THE CAPSULE ---
function createCapsuleFallback() {
    const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0055 });
    const capsule = new THREE.Mesh(geometry, material);
    capsule.position.y = 1; 
    scene.add(capsule);
    document.getElementById('status').innerText = "Error Loading Model: Using Capsule Fallback";
}

// --- MODEL LOADER ---
const loader = IS_GLB ? new GLTFLoader() : new FBXLoader();

loader.load(
    MODEL_PATH,
    (object) => {
        // Success Logic
        const model = IS_GLB ? object.scene : object;
        scene.add(model);
        document.getElementById('status').innerText = "Model Loaded Successfully";
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        // Error Logic
        console.error("An error happened during loading:", error);
        createCapsuleFallback();
    }
);

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
