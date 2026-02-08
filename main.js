import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// --- CONFIGURATION ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue
scene.fog = new THREE.Fog(0x87ceeb, 10, 50);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// --- LIGHTING ---
const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(5, 10, 5);
sunLight.castShadow = true;
scene.add(sunLight);

// --- FLOOR ---
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// --- MODEL LOADING ---
let mixer, playerModel;
const clock = new THREE.Clock();
const loader = new FBXLoader();

// REPLACE 'your_model.fbx' with your actual filename!
loader.load('models/your_model.fbx', (fbx) => {
    playerModel = fbx;
    playerModel.scale.setScalar(0.01); // Adjust if model is too big/small
    
    playerModel.traverse(c => {
        if (c.isMesh) c.castShadow = true;
    });

    scene.add(playerModel);

    if (fbx.animations.length > 0) {
        mixer = new THREE.AnimationMixer(fbx);
        const action = mixer.clipAction(fbx.animations[0]);
        action.play();
    }
});

// --- INPUTS ---
const keys = { w: false, a: false, s: false, d: false };
window.onkeydown = (e) => keys[e.key.toLowerCase()] = true;
window.onkeyup = (e) => keys[e.key.toLowerCase()] = false;

// --- GAME LOOP ---
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    if (playerModel) {
        const speed = 0.1;
        if (keys.w) playerModel.position.z -= speed;
        if (keys.s) playerModel.position.z += speed;
        if (keys.a) playerModel.position.x -= speed;
        if (keys.d) playerModel.position.x += speed;

        // Simple third-person camera follow
        camera.position.set(playerModel.position.x, playerModel.position.y + 4, playerModel.position.z + 8);
        camera.lookAt(playerModel.position);
    }

    renderer.render(scene, camera);
}

animate();

// Resize handling
window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};
