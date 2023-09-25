import { 
    AmbientLight,
     AxesHelper,
      BufferGeometry,
      Clock,
      DirectionalLight,
      Float32BufferAttribute,
      GridHelper,
      Group,
      Line,
      LineBasicMaterial,
      MathUtils,
      Mesh,
      MeshNormalMaterial,
      MeshPhongMaterial,
      PerspectiveCamera,
     PointLight,
     PointLightHelper,
     Points,
     PointsMaterial,
     Scene,
     SphereGeometry,
     TextureLoader,
     WebGLRenderer
    //  VertexColors
} from 'three'
import * as THREE from 'three'; 
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import './style.css'

const scene = new Scene;
// scene.add(new AxesHelper());

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 75
camera.position.x = 1
camera.position.y = 1
scene.add(camera)

// LIGHTS

const dirLight = new DirectionalLight( 0xffffff, 0.4 );
dirLight.position.set( 0, 0, 1 ).normalize();
scene.add( dirLight );

const pointLight = new PointLight(0xffffff, 4.5, 0, 0 );
pointLight.color.setHSL( Math.random(), 1, 0.5 );
pointLight.position.set( 0, 100, 90 );
scene.add( pointLight );

const distance = 400;
const group = new Group();
function addBoxes() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(distance));
    const total = Math.abs(x)+Math.abs(y)-z;
    const opacity = 1 / total;
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe:true, transparent:true, opacity:  Math.abs(opacity)*5  });
    const star = new THREE.Mesh(geometry, material);
    star.position.set(x, y, z);
    group.add(star);
}

Array(2000).fill().forEach(addBoxes);
function addSpheres() {
    const geometry = new THREE.SphereGeometry(1, 12, 12);
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(distance));
    const total = Math.abs(x)+Math.abs(y)+Math.abs(z);
    const opacity = 1 / total;
    // console.log("x", x);
    // console.log("y", y);
    // console.log("z", z);
    // console.log("total", total);
    // console.log("opacity", opacity);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe:true, transparent:true, opacity:  Math.abs(opacity)*5 });
    const star = new THREE.Mesh(geometry, material);
    star.position.set(x, y, z);
    group.add(star);
}

Array(1000).fill().forEach(addSpheres);

var font
const fontLoader = new FontLoader();
fontLoader.load( '/dist/helvetiker_regular.typeface.json', function ( response ) {
    font = response;
    // const helvetikerRegular = new FontLoader().parse(helvetiker)
    const textGeometry = new TextGeometry( 'A World of Geometry', {
        font: font,
        size: Math.max(window.innerWidth,window.innerHeight) / Math.max(window.innerWidth,window.innerHeight) * 4,
        height: 2,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 0.1,
        bevelSize: 0.1 ,
        // bevelOffset: 0,
        // bevelSegments: 5
    } );
    textGeometry.center()
    // textGeometry.computeBoundingBox();
    const textMaterials = [
        new MeshPhongMaterial( { color: 0x000000, flatShading: true } ), // front
        new MeshPhongMaterial( { color: 0x000000 } ) // side
    ];
    const textMesh = new Mesh( textGeometry, textMaterials );
    group.add(textMesh)
} );
// Lines
const countLines = 100;
const lines = new Float32Array(countLines*3); 
for(let i = 0; i < lines.length ; i++)
{
    lines[i] = MathUtils.randFloatSpread(distance)
}
const lineGeometry = new BufferGeometry();
lineGeometry.setAttribute('position', new Float32BufferAttribute(lines, 3))
const lineMaterial = new LineBasicMaterial({
    color: 0x7a7a7a,
    opacity: .08   ,
    transparent:true,
    // depthWrite:false
})
const lineObject = new Line(lineGeometry, lineMaterial)
group.add(lineObject)


scene.add(group);
const renderer = new WebGLRenderer({
    antialias:true,
    alpha:true
});
const controls = new OrbitControls(camera, renderer.domElement)

renderer.setClearColor(0x000000, 0) // bg transparent
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
document.body.appendChild(renderer.domElement)
const clock = new Clock();
let mouseX = 0;
let mouseY = 0;
window.isClicking = false
window.addEventListener('mousedown', e => window.isClicking = true)
window.addEventListener('touchstart', e => window.isClicking = true)
window.addEventListener('mouseup', e => window.isClicking = false)
window.addEventListener('touchend', e => window.isClicking = false)
window.isClickAble = false;
window.addEventListener('mousemove', e => {
    window.isClickAble = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
})
window.addEventListener('touchmove', e => {
    if( window.isClickAble == false)
    {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
})
function animate()
{
    const time = clock.getElapsedTime();
    if(window.isClicking == true)
    {
        const ratio1 = (mouseX / window.innerWidth-0.5) * 5;
        const ratio2 = (mouseY / window.innerHeight-0.5) * 5;
        group.rotation.y = ratio1 - time * 0.1
        group.rotation.x = ratio2 - time * 0.1
    }
    // group.rotation.x += time * 0.03
    // group.rotation.y += time * 0.03
    group.rotation.x -=  0.0005
    group.rotation.y -=  0.0005
    renderer.render(scene, camera);
    // controls.update()
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