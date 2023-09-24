import { AmbientLight, AxesHelper,  GridHelper,  Mesh,  MeshStandardMaterial,  PerspectiveCamera, PointLight, PointLightHelper, Scene, SphereGeometry, WebGLRenderer } from 'three'
import * as THREE from 'three'; 
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import './style.css'

const scene = new Scene;
scene.add(new AxesHelper());

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 5
camera.position.x = 1
camera.position.y = 1
scene.add(camera)

const sphere = new Mesh(
    new SphereGeometry(2,30,30),
    new MeshStandardMaterial({color:0xFF6347})
    )
scene.add(sphere)

const vertices = [];
for ( let i = 0; i < 10000; i ++ ) {
	const x = THREE.MathUtils.randFloatSpread( 2000 );
	const y = THREE.MathUtils.randFloatSpread( 2000 );
	const z = THREE.MathUtils.randFloatSpread( 2000 );

	vertices.push( x, y, z );
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
const material = new THREE.PointsMaterial( 
    { 
        color: 0x888888,
        size: 0.5 
} );
const points = new THREE.Points( geometry, material );
scene.add( points );

const pointLight = new PointLight(0xffffff);
const ambientLight = new AmbientLight(0xffffff);
pointLight.position.set(2,1,3);
scene.add(pointLight, ambientLight)
scene.add(pointLight)

const lightHelper = new PointLightHelper(pointLight);
const gridHelper = new GridHelper(200,50);
// scene.add(lightHelper, gridHelper)

const renderer = new WebGLRenderer({
    canvas: document.getElementById('renderer'),
    antialias:true
});
const controls = new OrbitControls(camera, renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

function animate()
{
    renderer.render(scene, camera);
    sphere.rotation.x += 0.005;
    sphere.rotation.z += 0.005;
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