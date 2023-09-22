import { Scene, WebGLRenderer } from 'three'
import './style.css'

const scene = new Scene;

const renderer = new WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

document.body.appendChild(renderer.domElement);