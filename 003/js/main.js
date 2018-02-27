const myVert = require('./../shader/sample.vert');
const myFrag = require('./../shader/sample.frag');

let notWebGL = function(){
  // webGL非対応時の記述
  console.log('this browser does not support webGL')
};

if(document.getElementsByTagName('html')[0].classList.contains('no-webgl')){
  notWebGL();
}

// three.jsのとき
try{
  let renderer = new THREE.WebGLRenderer();
}catch (e){
  notWebGL();
}

// 返ってくる値を確認してみましょう！
console.log(ubu.detect);
// IEの時
if(ubu.detect.browser.ie){
  console.log('IEさん、動画テクスチャはちょっと…無理ですね…')
}

window.onload = () => {
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  // rendererの作成
  let renderer = new THREE.WebGLRenderer();
  // canvasをbodyに追加
  document.body.appendChild(renderer.domElement);

  // canvasをリサイズ（学習用なのでリサイズイベント登録は省略）
  renderer.setSize(windowWidth, windowHeight);

  // scene作成
  let scene = new THREE.Scene();
  // camera作成
  let camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
  camera.position.z = 100;

  // Geometry作成
  let geometry = new THREE.PlaneBufferGeometry(100, 100);
  // Material作成
  let material = new THREE.ShaderMaterial({
    vertexShader: myVert,
    fragmentShader: myFrag
  });
  // Mesh作成
  let mesh = new THREE.Mesh(geometry,material);

  // Meshをシーンに追加
  scene.add(mesh);

  // draw
  renderer.render(scene, camera);
};