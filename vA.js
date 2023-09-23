import { 
    AmbientLight,
     AxesHelper,
      BufferGeometry,
      Clock,
      Float32BufferAttribute,
      GridHelper,
      Group,
      Line,
      LineBasicMaterial,
      MathUtils,
      Mesh,
      MeshNormalMaterial,
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
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import './style_vA.css'

const textureLoader = new TextureLoader()
const starTexture = textureLoader.load('/star.png')

const scene = new Scene;
// scene.add(new AxesHelper());

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 5
camera.position.x = 1
camera.position.y = 1
scene.add(camera)

const count = 10000
const distance = 200;
const countLines = 100;
// Points
const points = new Float32Array(count*3); 
const colors = new Float32Array(count*3); 
const lines = new Float32Array(countLines*3); 
for(let i = 0; i < points.length ; i++)
{
    points[i] = MathUtils.randFloatSpread(distance*2)
    colors[i] = Math.random() / 10 + 0.2;
    if(i < lines.length)
    {
        lines[i] = MathUtils.randFloatSpread(distance*2)
    }
}
const pointGeometry = new BufferGeometry();
pointGeometry.setAttribute('position', new Float32BufferAttribute(points, 3))
pointGeometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
const pointMaterial = new PointsMaterial({
    // color:0x000000,
    vertexColors:colors,
    size:1,
    map: starTexture,
    alphaTest: 0.01,
    transparent:true,
    opacity:.8
})
const pointObject = new Points(pointGeometry, pointMaterial);
const group = new Group();
group.add(pointObject);

// Lines
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
window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
})
function animate()
{
    const time = clock.getElapsedTime();
    const ratio1 = (mouseX / window.innerWidth-0.5) * 2;
    const ratio2 = (mouseY / window.innerHeight-0.5) * 2;
    group.rotation.y = ratio1 * Math.PI * 0.1
    group.rotation.x = ratio2 * Math.PI * 0.1
    group.rotation.x += time * 0.03
    group.rotation.y += time * 0.03
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