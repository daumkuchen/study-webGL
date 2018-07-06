const bgVertexShaderSrc = `
  precision mediump float;
  attribute vec4 position;
  varying vec2 vUv;
  void main() {
    gl_Position = position;
    vUv = vec2( (position.x + 1.)/2., (-position.y + 1.)/2.);
  }
`;

const bgFragmentShaderSrc = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTrans;
  void main(){
    vec4 color;
    if(vUv.x > uTrans){
      color = vec4(0.0, 0.0, 0.0, 1.0);;
    } else if(vUv.x < 0.5){
      color = vec4(0.45, 0.06, 0.05, 1.0);
    }else{
      color = vec4(0.13, 0.25, 0.37, 1.0);
    }

    gl_FragColor = color;
  }
`;

// パーティクルのシェーダー
const particleVertexShaderSrc = `
  precision mediump float;
  attribute vec4 position;
  attribute vec4 color;
  uniform vec2 uWindow;
  uniform vec2 uTrans;
  uniform float uAngle;
  varying vec4 vColor;
  vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
  }
  void main() {
    vec2 trasformedPos = rotate(vec2(position.x, position.z), uAngle);
    vec3 newPosition = vec3(trasformedPos.x, position.y, trasformedPos.y);
    float scale = max(1.0 - newPosition.z / 1800., 0.01);
    gl_Position = vec4( (newPosition.x * scale + uTrans.x) / uWindow.x , (newPosition.y * scale + uTrans.y) /uWindow.y , 0.0, 1.0);
    gl_PointSize = 3. * scale;
    vColor = color;
  }
`;

const particleFragmentShaderSrc = `
  precision mediump float;
  varying vec4 vColor;
  void main(){
    vec2 diff = gl_PointCoord - vec2(.5, .5);
    if (length(diff) > 0.5)
    discard;
    gl_FragColor = vColor;
    // gl_FragColor.a = 0.1;
  }
`;

let loadingDiv = document.getElementById("loading");
let canvas = document.getElementById("main");
let gl;
let loopId;

// バックグラウンド関係
let bgProgram;
let positionLocation,
positionBuffer;
let obj = {
  loadTrans: 0
};

// パーティクル関係
let steakParticleManager,
sushiParticleManager;
let particleManagerArr = [];

let windowWid = window.innerWidth;
let windowHig = window.innerHeight;
let mouseX;

let renderer,
scene,
camera;
let scene2;

class Particle {
  constructor() {
    this.x = window.innerWidth * (Math.random() - 0.5) * 0.4;
    this.y = -200 * Math.random();
    this._initX = this.x;
    this._initY = this.y;

    this.z = 0;
    this.r = 1;
    this.g = 1;
    this.b = 1;
    this.a = 0;

    this._selcted = false;
    this._prevSelcted = false;

    this._isLoaded = false;
    this._trans = 0;
    this._curPicId = 0;

    this._randomX = 300 * (-Math.random() + 0.5);
    this._randomY = 300 * (-Math.random() + 0.5);
    this._randomZ = 150 * (-Math.random() + 0.5);

    this._imgColorArr = [];
  }
  update(mouseX) {}
  resize() {}
  setTextPosition(xx, yy, alpha) {
    this._textInitPosition = {
      x: xx * 2,
      y: yy * -2
    };
    this._textAlpha = alpha;
  }
  setImageData(index, xx, yy, rr, gg, bb, aa) {
    this._imgColorArr[index] = {
      x: xx,
      y: yy,
      r: rr,
      g: gg,
      b: bb,
      a: aa
    };
  }
  initUpdate(trans) {
    this._isLoaded = true;
    this.x = this._initX * (1 - trans) + this._textInitPosition.x * trans;
    this.y = this._initY * (1 - trans) + this._textInitPosition.y * trans;
    this.a = this._textAlpha * 0.05 * (Math.random() + 1) * trans;
  }
  startShowPicture() {
    this._ori = {
      x: this.x,
      y: this.y,
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a
    };
  }
  startHidePicture() {
    this.startShowPicture();
  }
  startUpdatePicture() {
    this.startShowPicture();
    this._curPicId = (this._curPicId + 1) % 3;
  }
  updatePicture(trans) {
    let target = this._imgColorArr[this._curPicId];

    let rate = trans * (1 - trans) * 4;

    this.x = target.x * trans + this._ori.x * (1 - trans) + rate * this._randomX;
    this.y = target.y * trans + this._ori.y * (1 - trans) + rate * this._randomY;
    this.z = rate * this._randomZ;

    // this.z = 100;
    this.r = target.r * trans + this._ori.r * (1 - trans);
    this.g = target.g * trans + this._ori.g * (1 - trans);
    this.b = target.b * trans + this._ori.b * (1 - trans);
    this.a = (target.a * trans + this._ori.a * (1 - trans)) * (1 - rate) + rate * 0.3;
  }
  updateHidePicture(trans) {
    let target = {
      x: this._textInitPosition.x,
      y: this._textInitPosition.y,
      r: 1,
      g: 1,
      b: 1,
      a: this._textAlpha * 0.08
    };

    let rate = trans * (1 - trans) * 4;

    this.x = target.x * trans + this._ori.x * (1 - trans) + rate * this._randomX;
    this.y = target.y * trans + this._ori.y * (1 - trans) + rate * this._randomY;
    this.z = rate * this._randomZ;

    // this.z = 100;
    this.r = target.r * trans + this._ori.r * (1 - trans);
    this.g = target.g * trans + this._ori.g * (1 - trans);
    this.b = target.b * trans + this._ori.b * (1 - trans);
    this.a = (target.a * trans + this._ori.a * (1 - trans)) * (1 - rate) + rate * 0.3;
  }
}

// particleManagerクラスで生成したオブジェクトにつき1つのドロー関数を呼ぶ
class ParticleManager {
  constructor(side = "left") {
    this._particleSize = 256 * 256;
    this._side = side;
    this.resize();

    this._transY = 0;
    this._isShowImage = false;
    this._isFlip = false;

    this._rot = 0;
    this._targetRot = 0;

    this._trans = 0;

    this._particlePositionsArray = new Float32Array(this._particleSize * 3);
    this._particleColorsArray = new Float32Array(this._particleSize * 4);

    this._needsUpdate = true;

    // this._createProgram();
    this._createMesh();
    this._createParticles();
    this._createBufferAttribute();

  }

  _createMesh() {
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        uWindow: {
          value: new THREE.Vector2(windowWid, windowHig)
        },
        uTrans: {
          value: new THREE.Vector2(this._transX, this._transY)
        },
        uAngle: {
          value: 0
        }
      },
      vertexShader: particleVertexShaderSrc,
      fragmentShader: particleFragmentShaderSrc
    });
    this.material.transparent = true;

    this.points = new THREE.Points(this.geometry, this.material);
  }

  // particleを生成する
  _createParticles() {
    this._particleArr = [];

    for (let ii = 0; ii < this._particleSize; ii++) {
      let particle = new Particle(this._side);
      this._particleArr.push(particle);
    }
  }

  _createBufferAttribute() {

    this._positionAttribute = new THREE.BufferAttribute(this._particlePositionsArray, 3);
    this._colorAttributes = new THREE.BufferAttribute(this._particleColorsArray, 4);

    this.geometry.addAttribute('position', this._positionAttribute);
    this.geometry.addAttribute('color', this._colorAttributes);

  }

  setTextData(data) {
    // let transX = this._side == "left" ? -windowWid / 4 : windowWid / 4;

    for (let ii = 0; ii < this._particleSize; ii++) {
      let particle = this._particleArr[ii];
      let randomPosition = parseInt((data.length / 3) * Math.random()) * 3;

      particle.setTextPosition(data[randomPosition], data[randomPosition + 1], data[randomPosition + 2] / 255);
    }
  }

  setPicturData(dataArr) {
    for (let jj = 0; jj < 3; jj++) {
      let colorData = dataArr[jj];
      for (let ii = 0; ii < this._particleSize; ii++) {
        let randomPosition = parseInt((colorData.length / 4) * Math.random());
        let xPos = (randomPosition % 256) - 128;
        let yPos = -parseInt(randomPosition / 256) + 128;
        xPos *= 2;
        yPos *= 2;
        randomPosition = randomPosition * 4;
        let rr = colorData[randomPosition];
        let gg = colorData[randomPosition + 1];
        let bb = colorData[randomPosition + 2];

        this._particleArr[ii].setImageData(jj, xPos, yPos, rr / 255, gg / 255, bb / 255, 1);
      }
    }
  }

  start() {
    this._startRate = 0;
    TweenMax.to(this, 1.5, {
      _startRate: 1,
      onUpdate: () => {
        this._needsUpdate = true;
        for (let ii = 0; ii < this._particleSize; ii++) {
          this._particleArr[ii].initUpdate(this._startRate);
        }
      },
      onComplete: () => {
        this._startAnimationDone = true;
      },
      ease: Quint.easeInOut
    });
  }

  update(mouseX) {
    if (this._startAnimationDone) {
      if (this._side == 'left') {
        if (mouseX < 0.5)
        this.selected = true;
        else if (mouseX < 1)
        this.selected = false;
        else
        this.selected = false;
      }
      else {
        if (mouseX < 0.5)
        this.selected = false;
        else if (mouseX < 1)
        this.selected = true;
        else
        this.selected = false;
      }
    }

    if (this._needsUpdate) {
      this._particleArr.forEach((particle, index) => {
        particle.update();

        this._particlePositionsArray[3 * index] = particle.x;
        this._particlePositionsArray[3 * index + 1] = particle.y;
        this._particlePositionsArray[3 * index + 2] = particle.z;

        this._particleColorsArray[4 * index] = particle.r;
        this._particleColorsArray[4 * index + 1] = particle.g;
        this._particleColorsArray[4 * index + 2] = particle.b;
        this._particleColorsArray[4 * index + 3] = particle.a;
      });

      this._positionAttribute.setArray(this._particlePositionsArray);
      this._positionAttribute.needsUpdate = true;

      this._colorAttributes.setArray(this._particleColorsArray);
      this._colorAttributes.needsUpdate = true;

      this.material.uniforms.uAngle.value = this._rot;

      this._needsUpdate = false;
    }

  }

  updateNewPicture() {
    if (!this.isShowImage)
    return;

    TweenMax.killTweensOf(this);

    for (let ii = 0; ii < this._particleSize; ii++) {
      let particle = this._particleArr[ii];
      particle.startUpdatePicture();
    }

    this._origRot = this._rot;
    this._targetRot += Math.PI;
    this._isFlip = !this._isFlip;

    TweenMax.fromTo(this, 1.5, {
      _trans: 0
    }, {
      _trans: 1,
      ease: Power3.easeInOut,
      onUpdate: () => {
        this._needsUpdate = true;
        this._rot = this._origRot * (1 - this._trans) + this._targetRot * this._trans;
        for (let ii = 0; ii < this._particleSize; ii++) {
          let particle = this._particleArr[ii];
          particle.updatePicture(this._trans);
        }
      },
      onComplete: () => {}
    });
  }

  showPicture() {
    if (this.isShowImage)
    return;

    TweenMax.killTweensOf(this);

    this.isShowImage = true;
    this.isShowImageAnimationDone = false;

    this._origRot = this._rot;
    this._targetRot += Math.PI;
    this._isFlip = !this._isFlip;

    for (let ii = 0; ii < this._particleSize; ii++) {
      let particle = this._particleArr[ii];
      particle.startShowPicture();
    }

    TweenMax.fromTo(this, 1.5, {
      _trans: 0
    }, {
      _trans: 1,
      ease: Power3.easeInOut,
      onUpdate: () => {
        this._needsUpdate = true;
        this._rot = this._origRot * (1 - this._trans) + this._targetRot * this._trans;
        for (let ii = 0; ii < this._particleSize; ii++) {
          let particle = this._particleArr[ii];
          particle.updatePicture(this._trans);
        }
      },
      onComplete: () => {
        this.isShowImageAnimationDone = true;
      }
    });
  }

  hidePicture() {
    if (!this.isShowImage)
    return;
    TweenMax.killTweensOf(this);

    this.isShowImage = false;
    this._origRot = this._rot;
    if (this._isFlip)
    this._targetRot += Math.PI;
    this._isFlip = false;

    for (let ii = 0; ii < this._particleSize; ii++) {
      let particle = this._particleArr[ii];
      particle.startHidePicture();
    }

    TweenMax.fromTo(this, 1.5, {
      _trans: 0
    }, {
      _trans: 1,
      ease: Power3.easeInOut,
      onUpdate: () => {
        this._needsUpdate = true;
        this._rot = this._origRot * (1 - this._trans) + this._targetRot * this._trans;
        for (let ii = 0; ii < this._particleSize; ii++) {
          let particle = this._particleArr[ii];
          particle.updateHidePicture(this._trans);
        }
      }
    });

  }

  click() {
    this.updateNewPicture();
  }

  set selected(value) {
    this._prevSelcted = this._selcted;
    this._selcted = value;

    if (this._selcted && !this._prevSelcted)
    this.showPicture();
    if (this._prevSelcted && !this._selcted)
    this.hidePicture();
  }

  get selected() {
    return this._selcted;
  }

  resize() {
    this._transX = windowWid / 2;
    if (this._side == "left")
    this._transX *= -1;

    if (this.material) {
      this.material.uniforms.uTrans.value.x = this._transX;

      this.material.uniforms.uWindow.value.x = windowWid;
      this.material.uniforms.uWindow.value.y = windowHig;
    }
  }
}

// デモに使用する画像URL
const assetUrls = [
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13842/sushi0.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13842/sushi1.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13842/sushi2.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13842/steak0.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13842/steak1.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13842/steak2.jpg"
];

const jsonAssetUrls = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13842/textData.json";

const TOTAL_LOADED = assetUrls.length + 1;
let curLoadNum = 0;

let sushiImgArr = [];
let steakImgArr = [];
let textData;

initThree();

let imgCanvas = document.createElement('canvas');
imgCanvas.width = 256;
imgCanvas.height = 256;
let imgCtx = imgCanvas.getContext('2d');

startLoading();

function initThree() {
  renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(windowWid, windowHig);
  scene = new THREE.Scene();
  // カメラの初期化
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
  camera.position.z = 1;
}

let mat = new THREE.RawShaderMaterial({
  uniforms: {
    uTrans: {
      value: obj.loadTrans
    }
  },
  vertexShader: bgVertexShaderSrc,
  fragmentShader: bgFragmentShaderSrc
});

let geo = new THREE.PlaneGeometry(2, 2);
let mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

createParticleManager();

loopId = requestAnimationFrame(loop);

function createParticleManager() {
  steakParticleManager = new ParticleManager("left");
  sushiParticleManager = new ParticleManager("right");
  particleManagerArr.push(steakParticleManager, sushiParticleManager);

  scene.add(steakParticleManager.points);
  scene.add(sushiParticleManager.points);
}

function startLoading() {
  assetUrls.forEach((url, index) => {
    let img = new Image();

    img.onload = () => {

      curLoadNum++;
      TweenMax.to(obj, 0.4, {
        loadTrans: curLoadNum / (TOTAL_LOADED + 1)
      });
      if (curLoadNum === TOTAL_LOADED)
      start();
    };
    img.crossOrigin = 'Anonymous';
    img.src = url;

    if (index < 3)
    sushiImgArr.push(img);
    else
    steakImgArr.push(img);

  }
);

var xobj = new XMLHttpRequest();
xobj.overrideMimeType('application/json');
xobj.open('GET', jsonAssetUrls, true); // Replace 'my_data' with the path to your file
xobj.onreadystatechange = function() {
  if (xobj.readyState == 4 && xobj.status == "200") {
    textData = JSON.parse(xobj.responseText);
    curLoadNum++;
    TweenMax.to(obj, 0.4, {
      loadTrans: curLoadNum / (TOTAL_LOADED + 1)
    });
    if (curLoadNum === TOTAL_LOADED)
    start();
  }
};
xobj.send(null);
}

function start() {
  let steakImgDataArr = [];
  let sushiImgDataArr = [];

  for (let ii = 0; ii < steakImgArr.length; ii++) {
    imgCtx.drawImage(steakImgArr[ii], 0, 0);
    steakImgDataArr.push(imgCtx.getImageData(0, 0, 256, 256).data);
  }

  for (let ii = 0; ii < sushiImgArr.length; ii++) {
    imgCtx.drawImage(sushiImgArr[ii], 0, 0);
    sushiImgDataArr.push(imgCtx.getImageData(0, 0, 256, 256).data);
  }

  steakParticleManager.setTextData(textData['steak']);
  steakParticleManager.setPicturData(steakImgDataArr);
  sushiParticleManager.setTextData(textData['sushi']);
  sushiParticleManager.setPicturData(sushiImgDataArr);

  TweenMax.to(obj, 0.4, {loadTrans: 1});

  TweenMax.to('#loading', 0.8, {
    opacity: 0,
    ease: Quint.easeInOut
  })
  TweenMax.to('#mainTitle', 0.8, {
    opacity: 1,
    ease: Quint.easeInOut,
    delay: 0.4
  })

  setTimeout(() => {
    for (let ii = 0; ii < particleManagerArr.length; ii++) {
      particleManagerArr[ii].start();
    }
  }, 600);
}

function loop() {
  mat.uniforms.uTrans.value = obj.loadTrans;
  particleManagerArr.forEach(particleManager => {
    particleManager.update(mouseX);
  });

  renderer.render(scene, camera);

  requestAnimationFrame(loop);
}

function resize() {
  windowWid = window.innerWidth;
  windowHig = window.innerHeight;
  renderer.setSize(windowWid, windowHig);
}

window.addEventListener("resize", function() {
  resize();
});

document.body.addEventListener('mousemove', (event) => {
  mouseX = event.clientX / windowWid;
});

document.body.addEventListener('mouseleave', (event) => {
  mouseX = 9999;
});

document.body.addEventListener('click', (event) => {
  for (let ii = 0; ii < particleManagerArr.length; ii++) {
    particleManagerArr[ii].click();
  }
});
