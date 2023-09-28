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

// BOXES
const boxes_array = {};
const countBoxes = 2000;
function addBoxes(index) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(distance));
    const total = Math.abs(x)+Math.abs(y)-z;
    const opacity = 1 / total;
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe:true, transparent:true, opacity:  Math.abs(opacity)*5  });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, z);
    if(Math.random() >= 0.5)
        box.rotation.x = 0.5
    boxes_array[index] = box;
    group.add(box);
}
for(let i = 0; i < countBoxes; i++)
{
    addBoxes(i);
}

// SPHERES
const sphere_array = {};
const countSphere = 1000;
function addSpheres(index) {
    const geometry = new THREE.SphereGeometry(1, 12, 12);
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(distance));
    const total = Math.abs(x)+Math.abs(y)+Math.abs(z);
    const opacity = 1 / total;
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe:true, transparent:true, opacity:  Math.abs(opacity)*5 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    sphere_array[index] = sphere;
    group.add(sphere);
}
for(let i = 0; i < countSphere; i++)
{
    addSpheres(i);
}

// TEXT
const baseUrl = (window.location.href.includes("threejs-space-and-particles") ? "/threejs-space-and-particles/dist" : "/dist");
var font
const fontLoader = new FontLoader();
fontLoader.load( `${baseUrl}/helvetiker_regular.typeface.json`, function ( response ) {
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
const lines_array = {};
function addLines(index, opacity = 0.08, position = null)
{
    // console.log("addLines opacity : ", opacity);
    let geometry;
    if(position == null)
    {
        const points = [];
        for(let i = 0; i < 2 ; i++)
        {
            const [x, y, z] = Array(3)
            .fill()
            .map(() => THREE.MathUtils.randFloatSpread(distance));
            points.push( new THREE.Vector3( x, y, z ) );
        }
        geometry = new THREE.BufferGeometry().setFromPoints( points );
    }
    else
    {
        geometry = new THREE.BufferGeometry().setAttribute('position', position)
    }
    // geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
    let color = (index == 5 ? 0x00f00f : 0x7a7a7a )
    const material = new LineBasicMaterial({
        color: color,
        opacity: opacity.toFixed(2),
        transparent:true,
        // depthWrite:false
    })
    const line = new Line(geometry, material)
    // console.log("line", line);
    lines_array[index] = line;
    scene.add(line);
    return line;
}
for(let i = 0; i < countLines; i++)
{
    addLines(i);
}

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
let previousTime =  Math.floor(clock.getElapsedTime());
function growAndUngrowSphere(sphereId, growing = true )
{
    if(growing == true)
    {
        const sphere = growingSpheres[sphereId];
        sphere.scale.x += 0.01
        sphere.scale.y += 0.01
        sphere.scale.z += 0.01
        if(sphere.scale.x >= 3 )
        {
            delete growingSpheres[sphereId];
            ungrowingSpheres[sphereId] = sphere;
        }
    }
    else
    {
        const sphere = ungrowingSpheres[sphereId];
        sphere.scale.x -= 0.01
        sphere.scale.y -= 0.01
        sphere.scale.z -= 0.01
        if(sphere.scale.x < 1)
        {
           delete ungrowingSpheres[sphereId]
        }
    }
}
function growAndUngrowLines(lineId, growing = true )
{
    if(growing == true)
    {
        if(typeof growingLines[lineId] == "undefined")
        {
            console.log("growingLines[lineId] not found : ", lineId);
            return;
        }
        const line = growingLines[lineId].object;
        const position = line.geometry.attributes.position;
        const newOpacity = parseFloat( growingLines[lineId].opacity) + 0.001
        if(lineId == 5)
        {
            // console.log("growing");
            // console.log("newOpacity", newOpacity);
        }
        scene.remove(line)
        const newLine = addLines(lineId, newOpacity, position)
        if(newOpacity >= 0.5 )
        {
            const clone = Object.assign({}, growingLines[lineId]);
            delete growingLines[lineId];
            ungrowingLines[lineId] = clone;
        }
        else
        {
            growingLines[lineId] = {object : newLine, opacity:newOpacity};
        }
    }
    else
    {
        if(typeof ungrowingLines[lineId] == "undefined")
        {
            console.log("ungrowingLines[lineId] not found : ", lineId);
            return;
        }
        const line = ungrowingLines[lineId].object;
        const newOpacity = parseFloat( ungrowingLines[lineId].opacity) - 0.001;
        if(lineId == 5)
        {
            // console.log("ungrowing");
            // console.log("newOpacity", newOpacity);
        }
        const position = line.geometry.attributes.position;
        scene.remove(line)
        const newLine = addLines(lineId, newOpacity, position)
        if(newOpacity <= 0.08)
        {
           delete ungrowingLines[lineId]
        }
        else
        {
            ungrowingLines[lineId] = {object : newLine, opacity:newOpacity};
        }
    }
}
const growingSpheres = {};
const ungrowingSpheres = {};
const growingLines = {};
const ungrowingLines = {};
function animate()
{
    const time = clock.getElapsedTime();
    if(window.isClicking == true)
    {
        const ratio1 = (mouseY / window.innerWidth);
        const ratio2 = (mouseX / window.innerHeight);
        group.rotation.x = ratio1 * 0.1
        group.rotation.y = ratio2 * 0.1
    }
    else
    {
        group.rotation.x -=  0.0005
        group.rotation.y -=  0.0005
       
        // Be executed 1 time per second
        if(previousTime != Math.floor(time))
        {
            // const randomIntLine = Math.floor(Math.random()*countLines);
            // const randomIntLine = 5;
            // const randLine = lines_array[randomIntLine];
            // if(typeof growingLines[randomIntLine] == "undefined" && typeof ungrowingLines[randomIntLine] == "undefined")
            // {
            //     growingLines[randomIntLine] = {object : randLine, opacity:0.08};
            // }
            previousTime = Math.floor(time)
        }

        // Growing and Decreasing Spheres
        const randomIntSphere = Math.floor(Math.random()*countSphere);
        const randSphere = sphere_array[randomIntSphere];
        if(typeof growingSpheres[randomIntSphere] == "undefined" && typeof ungrowingSpheres[randomIntSphere] == "undefined")
        {
            growingSpheres[randomIntSphere] = randSphere;
        }
        for(let sphereId in growingSpheres)
        {
            growAndUngrowSphere(sphereId, true)
        }
        for(let sphereId in ungrowingSpheres)
        {
            growAndUngrowSphere(sphereId, false)
        }
        // Lines appearing and disappearing
        // for(let lineId in growingLines)
        // {
        //     growAndUngrowLines(lineId, true)
        // }
        // for(let lineId in ungrowingLines)
        // {
        //     growAndUngrowLines(lineId, false)
        // }
       
        //Rotating boxes
        for(let box of Object.values(boxes_array))
        {
            box.rotation.y += 0.01
        }
    }

    
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