const THREE = require('three/build/three.js');
const dat = require('dat.gui');
const Stats = require('stats-js');

const Mesh = require('./Mesh').default;
const Post = require('./Post').default;
const OrbitControls = require('./_lib/OrbitControls.js')(THREE);

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

    this.mesh;
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
  onLoad() {

    this.targetDOM.width *= devicePixelRatio;
    this.targetDOM.height *= devicePixelRatio;
    this.targetDOM.style.width = String(this.targetDOM.width / devicePixelRatio) + 'px';

    // ===== scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 0.01, 1000);

    // ===== camera
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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.targetDOM.appendChild(this.renderer.domElement);
    this.controls = new THREE.OrbitControls(this.camera);

    this.createMesh();
    this.createLight();
    this.createPost();
    this.datGUI();
    this.statsFn();

    this.loop();
    this.animation();

    this.mesh.uniforms.resolution.value.x = this.renderer.domElement.width;
    this.mesh.uniforms.resolution.value.y = this.renderer.domElement.height;
    this.post.uniforms.resolution.value.x = this.renderer.domElement.width;
    this.post.uniforms.resolution.value.y = this.renderer.domElement.height;
  }
  onResize() {
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

    this.mesh.uniforms.resolution.value.x = this.renderer.domElement.width;
    this.mesh.uniforms.resolution.value.y = this.renderer.domElement.height;
    this.post.uniforms.resolution.value.x = this.renderer.domElement.width;
    this.post.uniforms.resolution.value.y = this.renderer.domElement.height;
  }
  onMousemove(e) {
    let x = e.clientX * 2.0 - this.winWidth;
    let y = e.clientY * 2.0 - this.winHeight;
    x /= this.winWidth;
    y /= this.winHeight;

    this.mesh.object.position.x = x * -0.1;
    this.mesh.object.position.y = y * -0.1;

    this.mesh.uniforms.mouse.value.x = e.pageX;
    this.mesh.uniforms.mouse.value.y = e.pageY;
    this.post.uniforms.mouse.value.x = e.pageX;
    this.post.uniforms.mouse.value.y = e.pageY;
  }
  loop() {
    this.stats.begin();
    this.stats.end();
    this.count++;
    this.renderer.setClearColor(new THREE.Color(0xffffff));
    this.renderer.render(this.scene, this.camera, this.rendererPost);
    this.renderer.setClearColor(new THREE.Color(0xffffff));
    this.renderer.render(this.scenePost, this.cameraPost);
    requestAnimationFrame(this.loop.bind(this));
  }
  animation() {

    this.mesh.uniforms.time.value += 0.05;
    this.post.uniforms.time.value += 0.05;

    requestAnimationFrame(this.animation.bind(this));
  }
  createMesh() {
    this.mesh = new Mesh;
    this.mesh.createObject();
    this.mesh.object.position.z = -1.0;
    this.scene.add(this.mesh.object);
  }
  createLight() {
    this.ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambient);
    this.directional = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directional.position.set(10.0, 10.0, 10.0);
    this.directional.castShadow = true;
    this.directional.shadow.mapSize.width = 1024;
    this.directional.shadow.mapSize.height = 1024;
    this.directional.shadow.camera.near = 0.01;
    this.directional.shadow.camera.far = 500;
    this.scene.add(this.directional);
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
    this.scenePost.add(this.post.object);
  }
  datGUI () {

    this.gui = new dat.GUI();

    // guiPostColor
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
  statsFn() {
    this.stats = new Stats();
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    document.body.appendChild(this.stats.domElement);
  }
  init() {
    this.onLoad();
    window.addEventListener('resize', this.onResize.bind(this), false);
    window.addEventListener('mousemove', this.onMousemove.bind(this), false);
  }
}
