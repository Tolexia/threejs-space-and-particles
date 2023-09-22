import { AmbientLight, AxesHelper,  BufferGeometry,  Float32BufferAttribute,  GridHelper,  MathUtils,  Mesh,  MeshNormalMaterial,  PerspectiveCamera, PointLight, PointLightHelper, Points, PointsMaterial, Scene, SphereGeometry, TextureLoader, WebGLRenderer } from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import './style_vA.css'

const textureLoader = new TextureLoader()
const starTexture = textureLoader.load('/star.png')

const scene = new Scene;
scene.add(new AxesHelper());

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 5
camera.position.x = 1
camera.position.y = 1
scene.add(camera)

const count = 10000
const distance = 200;
const points = new Float32Array(count*3); 
for(let i = 0; i < points.length ; i++)
{
    points[i] = MathUtils.randFloatSpread(distance*2)
}
const geometry = new BufferGeometry();
geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
const pointMaterial = new PointsMaterial({
    color:0x000000,
    size:1,
    map: starTexture,
    alphaTest: 0.01,
    transparent:true
})
const pointObject = new Points(geometry, pointMaterial);
scene.add(pointObject);

const renderer = new WebGLRenderer({
    antialias:true,
    alpha:true
});
const controls = new OrbitControls(camera, renderer.domElement)

renderer.setClearColor(0x000000, 0) // bg transparent
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
document.body.appendChild(renderer.domElement)
function animate()
{
    renderer.render(scene, camera);
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