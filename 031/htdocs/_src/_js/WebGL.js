import * as THREE from 'three';

import Stats from 'stats-js';
import Dat from 'dat.gui';
import OrbitControls from './_lib/OrbitControls';

import Plane from './Plane';
import Post from './Post';

export default class Sample {
  constructor() {

    this.ua = navigator.userAgent.toLowerCase();
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;

    this.renderer;
    this.scene;
    this.camera;
    this.controls;

    this.post;
    this.rendererPost;
    this.scenePost;
    this.cameraPost;

    this.plane;
    this.directional;
    this.ambient;

    this.gui;
    this.stats;

    this.targetDOM = document.getElementById('canvas');
    this.parameterCamera = {
      fovy: 60,
      aspect: this.winWidth / this.winHeight,
      near: 0.01,
      far: 5000.0,
      x: 0.0,
      y: 0.0,
      z: 4.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0)
    };
    this.count = null;
  }
  setup() {
    this.targetDOM.width *= devicePixelRatio;
    this.targetDOM.height *= devicePixelRatio;
    this.targetDOM.style.width = String(this.targetDOM.width / devicePixelRatio) + 'px';
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.parameterCamera.fovy,
      this.parameterCamera.aspect,
      this.parameterCamera.near,
      this.parameterCamera.far
    );
    this.camera.position.x = this.parameterCamera.x;
    this.camera.position.y = this.parameterCamera.y;
    this.camera.position.z = this.parameterCamera.z;
    this.camera.lookAt(this.parameterCamera.lookAt);
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.winWidth, this.winHeight);
    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.targetDOM.appendChild(this.renderer.domElement);
    this.controls = new THREE.OrbitControls(this.camera);

    this.createPlane();
    this.createPost();
    this.datGUI();
    this.stats();
    this.update();

    // **
    // uniforms.resolution
    // **
    this.plane.uniforms.resolution.value.x = this.renderer.domElement.width;
    this.plane.uniforms.resolution.value.y = this.renderer.domElement.height;
    this.post.uniforms.resolution.value.x = this.renderer.domElement.width;
    this.post.uniforms.resolution.value.y = this.renderer.domElement.height;

  }
  resize() {
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.camera.aspect = this.winWidth / this.winHeight;
    this.camera.updateProjectionMatrix();
    this.cameraPost.aspect = this.winWidth / this.winHeight;
    this.cameraPost.updateProjectionMatrix();
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.winWidth, this.winHeight);
    this.rendererPost.setSize(this.winWidth, this.winHeight);
    this.rendererPost.setSize(this.winWidth * window.devicePixelRatio || 1, this.winHeight * window.devicePixelRatio || 1);

    // **
    // uniforms.resolution
    // **
    this.plane.uniforms.resolution.value.x = this.renderer.domElement.width;
    this.plane.uniforms.resolution.value.y = this.renderer.domElement.height;
    this.post.uniforms.resolution.value.x = this.renderer.domElement.width;
    this.post.uniforms.resolution.value.y = this.renderer.domElement.height;

  }
  mousemove(e) {
    let x = e.clientX * 2.0 - this.winWidth;
    let y = e.clientY * 2.0 - this.winHeight;
    x /= this.winWidth;
    y /= this.winHeight;

    // this.plane.mesh.position.x = x * -0.1;
    // this.plane.mesh.position.y = y * -0.1;

    // **
    // uniforms.mouse
    // **
    this.plane.uniforms.mouse.value.x = e.pageX;
    this.plane.uniforms.mouse.value.y = e.pageY;
    this.post.uniforms.mouse.value.x = e.pageX;
    this.post.uniforms.mouse.value.y = e.pageY;
  }
  update() {

    this.stats.begin();
    this.stats.end();

    // **
    // uniforms.time
    // **
    this.count += .01;
    this.count = this.count % 360.;
    this.plane.uniforms.time.value = this.count;
    this.post.uniforms.time.value = this.count;

    this.renderer.setClearColor(new THREE.Color(0xffffff));
    this.renderer.render(this.scene, this.camera, this.rendererPost);
    this.renderer.setClearColor(new THREE.Color(0xffffff));
    this.renderer.render(this.scenePost, this.cameraPost);
    requestAnimationFrame(this.update.bind(this));
  }
  createPlane() {
    this.plane = new Plane;
    this.plane.setup();
    // this.plane.mesh.position.z = -1.0;
	
	  // this.plane.mesh.position.x = 1.0;
	  // this.plane.mesh.position.y = 1.0;
	  // this.plane.mesh.position.z = 1.0;
	
	  // setTimeout(function () {
		  this.scene.add(this.plane.mesh);
	  // }, 2000);
	  
	  
	  
	  
	  
  }
  createPost() {
    this.scenePost = new THREE.Scene();
    this.cameraPost = new THREE.PerspectiveCamera(
      this.parameterCamera.fovy,
      this.parameterCamera.aspect,
      this.parameterCamera.near,
      this.parameterCamera.far
    );
    this.cameraPost.position.x = this.parameterCamera.x;
    this.cameraPost.position.y = this.parameterCamera.y;
    this.cameraPost.position.z = 0.0;
    this.cameraPost.lookAt(this.parameterCamera.lookAt);
    this.rendererPost = new THREE.WebGLRenderTarget(
      this.winWidth,
      this.winHeight, {
      magFilter: THREE.NearestFilter,
      minFilter: THREE.NearestFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping
    });
    this.rendererPost.setSize(this.winWidth * window.devicePixelRatio || 1, this.winHeight * window.devicePixelRatio || 1);

    this.post = new Post(this.rendererPost.texture);
    this.post.setup();
    this.scenePost.add(this.post.mesh);
  }
  stats() {
    this.stats = new Stats();
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    document.body.appendChild(this.stats.domElement);
  }
  datGUI () {

    this.gui = new Dat.GUI();

    const postColor = new function() {
      this.r = 1.0;
      this.g = 1.0;
      this.b = 1.0;
    };

    const guiPostColor = this.gui.addFolder('postColor');
    guiPostColor.add(postColor, 'r', 0.0, 1.0).onChange((value) => {
      this.post.uniforms.colorR.value = value;
    });

    guiPostColor.add(postColor, 'g', 0.0, 1.0).onChange((value) => {
      this.post.uniforms.colorG.value = value;
    });

    guiPostColor.add(postColor, 'b', 0.0, 1.0).onChange((value) => {
      this.post.uniforms.colorB.value = value;
    });

    guiPostColor.open();
  }
  render() {
    this.setup();
    window.addEventListener('resize', this.resize.bind(this), false);
    window.addEventListener('mousemove', this.mousemove.bind(this), false);
  }
}
