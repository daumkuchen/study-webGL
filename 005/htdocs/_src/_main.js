// ==================================================
// 　　CONFIG
// ==================================================

const myVert = require('./../shader/main.vert');
const myFrag = require('./../shader/main.frag');

let notWebGL = function(){
  console.log('this browser does not support webGL')
};

if(document.getElementsByTagName('html')[0].classList.contains('no-webgl')){
  notWebGL();
}

// three.jsのとき
try {
  let renderer = new THREE.WebGLRenderer();
} catch(e) {
  notWebGL();
}

console.log('ubu = ' + ubu.detect);

if(ubu.detect.browser.ie){
  console.log('IEさん、動画テクスチャはちょっと…無理ですね…')
}

// ==================================================
// 　　MAIN
// ==================================================

window.onload = () => {

  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  let renderer = new THREE.WebGLRenderer();
  document.body.appendChild(renderer.domElement);
  renderer.setSize(windowWidth, windowHeight);

  // scene作成
  let scene = new THREE.Scene();

  // camera作成
  let camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
  camera.position.z = 100;

  // Geometry作成
  let geometry = new THREE.PlaneBufferGeometry(windowWidth, windowHeight);

  // uniform変数
  let uniforms = {
    resolution: {type: "v2", value: new THREE.Vector2()},
    time: {type: "f", value: 1.0},
    mouse: {type: "v2", value: new THREE.Vector2()}
  };

  // Material作成
  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: myVert,
    fragmentShader: myFrag
  });

  // Mesh作成
  let mesh = new THREE.Mesh(geometry, material);

  // Meshをシーンに追加
  scene.add(mesh);

  // draw
  renderer.render(scene, camera);

};
