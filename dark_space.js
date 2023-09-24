import { AmbientLight, AxesHelper,  TextureLoader, Points, MathUtils, PointsMaterial, Float32BufferAttribute , BufferGeometry, GridHelper,  Mesh,  MeshStandardMaterial,  PerspectiveCamera, PointLight, PointLightHelper, Scene, SphereGeometry, WebGLRenderer } from 'three'
import * as THREE from 'three'; 
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import './style.css'
const scene = new Scene;

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 10
camera.position.x = 1
camera.position.y = 1
scene.add(camera)


const count = 10000
const distance = 200;
const textureLoader = new TextureLoader()
const starTexture = textureLoader.load('/star.png')
// Points
const points = new Float32Array(count*3); 
for(let i = 0; i < points.length ; i++)
{
    points[i] = MathUtils.randFloatSpread(distance*2)
}
const pointGeometry = new BufferGeometry();
pointGeometry.setAttribute('position', new Float32BufferAttribute(points, 3))
const pointMaterial = new PointsMaterial({
    color:0xffffff,
    // vertexColors:colors,
    size:1,
    map: starTexture,
    alphaTest: 0.01,
    transparent:true,
    opacity:.8
})
const pointObject = new Points(pointGeometry, pointMaterial);
scene.add(pointObject);

// Background

// const spaceTexture = new THREE.TextureLoader().load('stars.jpg');
// scene.background = spaceTexture;

const earthTexture = new THREE.TextureLoader().load('earth.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const cloudTexture = new THREE.TextureLoader().load('earth_clouds.jpg');
//Earth
// MAKE IT A GROUP TO ADD CLOUDS !!!!!
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: normalTexture,
  })
);
// Earth Clouds
const cloudSegments = 200;
const cloudGeometry = new THREE.SphereGeometry(
  2.03,
  cloudSegments,
  cloudSegments
);
const cloudMaterial = new THREE.MeshPhongMaterial({
  precision: 'highp',
  map: cloudTexture,
  side: THREE.DoubleSide,
  opacity: 0.8,
  transparent: true,
  depthWrite: false,
  blending: THREE.CustomBlending,
  blendEquation: THREE.MaxEquation,
});
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
earth.add(cloudMesh);
scene.add(earth);

earth.position.z = 0;
// earth.position.setX(-10);

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x99ffff, 1.3);
directionalLight.position.set(800, 0.0, 0);
scene.add(directionalLight);

// const lightHelper = new PointLightHelper(pointLight);
// const gridHelper = new GridHelper(200,50);
// scene.add(lightHelper, gridHelper)

const renderer = new WebGLRenderer({
    canvas: document.getElementById('renderer'),
    antialias:true
});
const controls = new OrbitControls(camera, renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
})
function animate()
{
    renderer.render(scene, camera);
    earth.rotation.x += 0.0005;
    earth.rotation.y += 0.00075;
    earth.rotation.z += 0.0005;
    controls.update()
    camera.lookAt(0,0,0);
    requestAnimationFrame(animate)
}

animate()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
})