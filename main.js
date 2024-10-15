import "./style.css"
import * as THREE from "three"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"
import gsap from "gsap"

// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Create the camera
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 9;

const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas  , antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const loader = new RGBELoader();
loader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/zwartkops_curve_afternoon_2k.hdr',
  (texture)=>{
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  // scene.background = texture;

});

const radius = 1.3;
const segment = 66;
const OrbitRadius = 4.5;
const color = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
const textures = ["./csilla/color.png", "./earth/map.jpg","./venus/map.jpg","./volcanic/color.png"]
const spheres = new THREE.Group();

const starTexture = new THREE.TextureLoader().load('./stars.jpg');
starTexture.colorSpace = THREE.SRGBColorSpace;

const starGeometry = new THREE.SphereGeometry(50, 64 , 64);
const starMaterial = new THREE.MeshStandardMaterial({
  map: starTexture,
  transparent: true,
  opacity: 0.4,
  side : THREE.BackSide,
});
const starSphere = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starSphere);


const spheresMesh = []
0
for(let i = 0; i < 4; i++) {

  const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(textures[i]);
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(radius, segment,segment);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);

    spheresMesh.push(sphere)

    const angle = (i/4) * (Math.PI * 2);
    sphere.position.x = OrbitRadius * Math.cos(angle);
    sphere.position.z = OrbitRadius * Math.sin(angle);


    spheres.add(sphere);
}
spheres.rotation.x = 0.1
spheres.position.y = -0.8
scene.add(spheres);


let lastWheelTime = 0;
const throttleDelay = 2000
let scrollCount = 0

const throttlewheelhandler = (event) => {
  const currentTime = Date.now();
  if (currentTime - lastWheelTime >= throttleDelay) {
    lastWheelTime = currentTime;
    const direction = event.deltaY > 0 ? "down" : "up";
    scrollCount = (scrollCount+1) % 4
    console.log(direction);

    const headings =document.querySelectorAll(".heading")
    gsap.to(headings, {
      duration:1,
      y:`-=${100}%`,
      ease: "power1.inOut",
    })
    gsap.to(spheres.rotation, {
      duration:1,
      y: `-=${Math.PI/2}%`,
      ease: "power2.inOut", 
    })
    if(scrollCount === 0){
      gsap.to(headings,  {
        duration:1,
        y:`0`,
        ease: "power2.inOut",
      })
    }
}
};

window.addEventListener('wheel', throttlewheelhandler);

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    for(let i = 0; i < spheresMesh.length; i++) {
      const sphere = spheresMesh[i]
      sphere.rotation.y = clock.getElapsedTime() * 0.03
    }
    renderer.render(scene, camera);
}

animate();

// Responsive handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Adjust pixel ratio on resize
});