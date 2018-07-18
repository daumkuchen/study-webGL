(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\nvarying float vPositiony;\nvarying float vPositionz;\n\nvoid main(){\n\n  float py = vPositiony * 0.025 + 1.0;\n  float pz = vPositionz + 1.0;\n\n  // vec3 color = vec3(py, py, py);\n  vec3 color = vec3(0.9);\n\n  gl_FragColor = vec4(color, 1.0);\n}\n";

},{}],2:[function(require,module,exports){
module.exports = "uniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\nvarying float vPositiony;\nvarying float vPositionz;\n\nfloat random(vec2 st){\n  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);\n}\n\n//\tSimplex 3D Noise\n//\tby Ian McEwan, Ashima Arts\nvec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\nvec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\nfloat snoise(vec3 v){\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n  vec3 x1 = x0 - i1 + 1.0 * C.xxx;\n  vec3 x2 = x0 - i2 + 2.0 * C.xxx;\n  vec3 x3 = x0 - 1. + 3.0 * C.xxx;\n  i = mod(i, 289.0 );\n  vec4 p = permute( permute( permute(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n  float n_ = 1.0/7.0; // N=7\n  vec3  ns = n_ * D.wyz - D.xzx;\n  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n}\n\nvec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}\nvec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}\nfloat noise(vec3 p){\n  vec3 a = floor(p);\n  vec3 d = p - a;\n  d = d * d * (3.0 - 2.0 * d);\n  vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);\n  vec4 k1 = perm(b.xyxy);\n  vec4 k2 = perm(k1.xyxy + b.zzww);\n  vec4 c = k2 + a.zzzz;\n  vec4 k3 = perm(c);\n  vec4 k4 = perm(c + 1.0);\n  vec4 o1 = fract(k3 * (1.0 / 41.0));\n  vec4 o2 = fract(k4 * (1.0 / 41.0));\n  vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);\n  vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);\n  return o4.y * d.y + o4.x * (1.0 - d.y);\n}\n\nvoid main() {\n\n  float pz = position.z;\n\n        pz = noise(vec3(\n          position.x * 0.09,\n          position.y * 0.09,\n          // pz + random(position.xy) * 0.25\n          pz + (noise(position.xyx) * 0.2) + (random(position.xy) * 0.1)\n        )) * 20.0;\n\n        // pz = max(pz, 4.0);\n\n  vec3 dest = vec3(position.x, position.y, pz);\n\n  vPositiony = - position.y;\n  vPositionz = - position.z;\n\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(dest, 1.0);\n}\n";

},{}],3:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\nuniform sampler2D uTex;\nvarying vec2 vUv;\n\n// normal rad\nfloat rnd(vec2 n){\n  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n}\n\nvoid main() {\n\n  // vec2 ratio = vec2(\n  //   min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),\n  //   min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)\n  // );\n\n  vec2 ratio = vec2(\n    min((resolution.x / resolution.y) / (resolution.x / resolution.y), 1.0),\n    min((resolution.y / resolution.x) / (resolution.y / resolution.x), 1.0)\n  );\n\n  vec2 uv = vec2(\n    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,\n    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5\n  );\n\n  // vec4 color = vec4(1.0, 0.0, 1.0, 1.0);\n  // gl_FragColor = texture2D(uTex, uv) * color;\n\n  // ===== nomal rnd\n  // float r = rnd(gl_FragCoord.st + mod(time, 1.0));\n  // vec4 samplerColor = texture2D(uTex, uv);\n  // gl_FragColor = vec4(samplerColor.rgb * r, 1.0);\n\n  // ===== color dest\n  vec4 destColor = texture2D(uTex, uv);\n  // vec4 R = texture2D(uTex, uv + vec2( 0.002 * sin(mouse.x * 10.0), 0.0));\n  // vec4 G = texture2D(uTex, uv + vec2( 0.00  * cos(mouse.x * 10.0), 0.0));\n  // vec4 B = texture2D(uTex, uv + vec2(-0.002 * sin(mouse.x * 10.0), 0.0));\n  vec4 R = texture2D(uTex, uv + vec2( 0.005 * sin(floor(mouse.x)), 0.0));\n  vec4 G = texture2D(uTex, uv + vec2( 0.00  * cos(floor(mouse.x)), 0.0));\n  vec4 B = texture2D(uTex, uv + vec2(-0.005 * sin(floor(mouse.x)), 0.0));\n  // gl_FragColor = vec4(vec3(R.r, G.g, B.b), 1.0);\n\n  gl_FragColor = texture2D(uTex, uv);\n}\n";

},{}],4:[function(require,module,exports){
module.exports = "varying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  gl_Position = vec4(position, 1.0);\n}\n";

},{}],5:[function(require,module,exports){
'use strict';

(function () {

  // ==================================================
  // 　　SETTING
  // ==================================================

  var notWebGL = function notWebGL() {
    console.log('this browser does not support webGL');
  };

  if (document.getElementsByTagName('html')[0].classList.contains('no-webgl')) {
    notWebGL();
  }

  // try {
  //   let renderer = new THREE.WebGLRenderer();
  // } catch(e) {
  //   notWebGL();
  // }

  // console.log(ubu.detect);

  if (ubu.detect.browser.ie) {
    console.log('IEさん、動画テクスチャはちょっと…無理ですね…');
  }

  // ==================================================
  // 　　MAIN
  // ==================================================

  window.addEventListener('load', function () {

    // ==================================================
    // 　　CLASS
    // ==================================================

    var mainVert = require('./../_shader/main.vert');
    var mainFrag = require('./../_shader/main.frag');
    var postVert = require('./../_shader/post.vert');
    var postFrag = require('./../_shader/post.frag');
    var Perlin = require('./../js/lib/perlin.js').Perlin;

    var renderer = void 0;
    var scene = void 0;
    var camera = void 0;

    var uniforms = void 0;
    var geometry = void 0;
    var material = void 0;

    var directional = void 0;
    var ambient = void 0;

    var mesh = void 0;

    var controls = void 0;

    var renderer__POST = void 0;
    var scene__POST = void 0;
    var camera__POST = void 0;
    var uniforms__POST = void 0;
    var geometry__POST = void 0;
    var material__POST = void 0;
    var mesh__POST = void 0;

    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;
    var targetDOM = document.getElementById('canvas');
    // targetDOM.width *= devicePixelRatio;
    // targetDOM.height *= devicePixelRatio;
    // targetDOM.style.width = String(targetDOM.width / devicePixelRatio) + 'px';

    // ==================================================
    // 　　MOUSE
    // ==================================================

    window.addEventListener('mousemove', function (e) {
      var x = event.clientX * 2.0 - winWidth;
      var y = event.clientY * 2.0 - winHeight;
      x /= winWidth;
      y /= winHeight;

      // scene.position.x = -x * 10.0;
      // scene.position.y =  y * 10.0;

      uniforms.mouse.value.x = e.pageX;
      uniforms.mouse.value.y = e.pageY;
      uniforms__POST.mouse.value.x = e.pageX;
      uniforms__POST.mouse.value.y = e.pageY;
    }, false);

    // ==================================================
    // 　　RESIZE
    // ==================================================

    window.addEventListener('resize', function () {
      winWidth = window.innerWidth;
      winHeight = window.innerHeight;

      camera.aspect = winWidth / winHeight;
      camera.updateProjectionMatrix();
      camera__POST.aspect = winWidth / winHeight;
      camera__POST.updateProjectionMatrix();

      renderer.setSize(winWidth, winHeight);
      renderer__POST.setSize(winWidth, winHeight);

      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    }, false);

    // ==================================================
    // 　　SCROLL
    // ==================================================

    // let scrollWatch = () => {
    //   let scrollTop = $(window).scrollTop();
    //   scene.position.y = scrollTop * 0.02;
    //   window.requestAnimationFrame(scrollWatch);
    // }

    // ==================================================
    // 　　INIT
    // ==================================================

    var init = function init() {
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
      uniforms__POST.resolution.value.x = renderer.domElement.width;
      uniforms__POST.resolution.value.y = renderer.domElement.height;
    };

    // ==================================================
    // 　　RENDER
    // ==================================================

    var render = function render() {
      count++;

      // scene.rotation.y = -count * 0.001;

      uniforms.time.value += 0.05;
      uniforms__POST.time.value += 0.05;

      renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.clearColor));
      renderer.render(scene, camera, renderer__POST);

      renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.postColor));
      renderer.render(scene__POST, camera__POST);

      requestAnimationFrame(render);
    };

    // ==================================================
    // 　　PARAMETER
    // ==================================================

    var CAMERA_PARAMETER = {
      fovy: 60,
      aspect: winWidth / winHeight,
      near: 0.01,
      far: 5000.0,
      x: 0.0,
      y: 0.0,
      z: 50.0,
      lookAt: new THREE.Vector3(1.0, 1.0, 1.0)
    };

    var RENDERER_PARAMETER = {
      clearColor: 0x000000,
      postColor: 0xffffff
    };

    var MATERIAL_PARAMETER = {
      color: 0xff0000,
      side: THREE.DoubleSide
    };

    // ==================================================
    // 　　INITIALIZE / SCENE / CAMERA / RENDERER
    // ==================================================

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(RENDERER_PARAMETER.clearColor, 0.01, 1000);

    camera = new THREE.PerspectiveCamera(CAMERA_PARAMETER.fovy, CAMERA_PARAMETER.aspect, CAMERA_PARAMETER.near, CAMERA_PARAMETER.far);

    camera.position.x = CAMERA_PARAMETER.x;
    camera.position.y = CAMERA_PARAMETER.y;
    camera.position.z = CAMERA_PARAMETER.z;
    camera.lookAt(CAMERA_PARAMETER.lookAt);

    controls = new THREE.OrbitControls(camera);

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(winWidth, winHeight);

    targetDOM.appendChild(renderer.domElement);

    // ==================================================
    // 　　UNIFORMS
    // ==================================================

    uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      mouse: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      time: {
        type: 'f',
        value: 1.0
      }
    };

    geometry = new THREE.PlaneBufferGeometry(128, 128, 512, 512);

    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: mainVert,
      fragmentShader: mainFrag,
      side: THREE.FrontSide,
      wireframe: true,
      transparent: true
    });

    directional = new THREE.DirectionalLight(0xffffff);
    directional.position.set(0, 10, 0);
    // directional.shadowCameraVisible = true;
    // directional.castShadow = true;
    scene.add(directional);

    ambient = new THREE.AmbientLight(0xffffff, 0.2);
    // ambient.shadowCameraVisible = true;
    // ambient.castShadow = true;
    scene.add(ambient);

    mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.x = -Math.PI * 0.4;
    // mesh.position.y = -100.0;

    scene.add(mesh);

    // ==================================================
    // 　　POST
    // ==================================================

    scene__POST = new THREE.Scene();

    camera__POST = new THREE.PerspectiveCamera(CAMERA_PARAMETER.fovy, CAMERA_PARAMETER.aspect, CAMERA_PARAMETER.near, CAMERA_PARAMETER.far);
    camera__POST.position.x = CAMERA_PARAMETER.x;
    camera__POST.position.y = CAMERA_PARAMETER.y;
    camera__POST.position.z = CAMERA_PARAMETER.z;
    camera__POST.lookAt(CAMERA_PARAMETER.lookAt);

    renderer__POST = new THREE.WebGLRenderTarget(winWidth, winHeight, {
      magFilter: THREE.NearestFilter,
      minFilter: THREE.NearestFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping
    });
    renderer__POST.setSize(winWidth, winHeight);

    uniforms__POST = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      mouse: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      time: {
        type: 'f',
        value: 1.0
      },
      uTex: {
        type: 't',
        value: renderer__POST.texture
      }
    };

    // geometry__POST = new THREE.PlaneBufferGeometry(winWidth*0.5, winHeight*0.5);
    // geometry__POST = new THREE.PlaneBufferGeometry(2048, 1024);
    geometry__POST = new THREE.PlaneBufferGeometry(2, 2);

    material__POST = new THREE.ShaderMaterial({
      uniforms: uniforms__POST,
      vertexShader: postVert,
      fragmentShader: postFrag,
      transparent: true
      // fog: true
      // depthWrite: true,
      // side: THREE.DoubleSide
    });

    mesh__POST = new THREE.Mesh(geometry__POST, material__POST);
    scene__POST.add(mesh__POST);

    // ==================================================
    // 　　INIT
    // ==================================================

    init();

    var count = 0;
    render();
  }, false);
})();

},{"./../_shader/main.frag":1,"./../_shader/main.vert":2,"./../_shader/post.frag":3,"./../_shader/post.vert":4,"./../js/lib/perlin.js":6}],6:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*jshint esversion: 6 */
//credit: https://gist.github.com/banksean/304522#file-perlin-noise-simplex-js

var Perlin = function () {
    function Perlin() {
        _classCallCheck(this, Perlin);

        this.grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];
        this.p = [];
        for (var i = 0; i < 256; i++) {
            this.p[i] = Math.floor(Math.random() * 256);
        }

        // To remove the need for index wrapping, double the permutation table length
        this.perm = [];
        for (i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
        }

        // A lookup table to traverse the simplex around a given point in 4D.
        // Details can be found where this table is used, in the 4D noise method.
        this.simplex = [[0, 1, 2, 3], [0, 1, 3, 2], [0, 0, 0, 0], [0, 2, 3, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 3, 0], [0, 2, 1, 3], [0, 0, 0, 0], [0, 3, 1, 2], [0, 3, 2, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 3, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 0, 3], [0, 0, 0, 0], [1, 3, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 3, 0, 1], [2, 3, 1, 0], [1, 0, 2, 3], [1, 0, 3, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 3, 1], [0, 0, 0, 0], [2, 1, 3, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 1, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 0, 1, 2], [3, 0, 2, 1], [0, 0, 0, 0], [3, 1, 2, 0], [2, 1, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 1, 0, 2], [0, 0, 0, 0], [3, 2, 0, 1], [3, 2, 1, 0]];
    }

    _createClass(Perlin, [{
        key: "dot",
        value: function dot(g, x, y) {
            return g[0] * x + g[1] * y;
        }
    }, {
        key: "noise",
        value: function noise(xin, yin) {
            var n0, n1, n2; // Noise contributions from the three corners
            // Skew the input space to determine which simplex cell we're in
            var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
            var s = (xin + yin) * F2; // Hairy factor for 2D
            var i = Math.floor(xin + s);
            var j = Math.floor(yin + s);
            var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
            var t = (i + j) * G2;
            var X0 = i - t; // Unskew the cell origin back to (x,y) space
            var Y0 = j - t;
            var x0 = xin - X0; // The x,y distances from the cell origin
            var y0 = yin - Y0;
            // For the 2D case, the simplex shape is an equilateral triangle.
            // Determine which simplex we are in.
            var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
            if (x0 > y0) {
                i1 = 1;j1 = 0;
            } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            else {
                    i1 = 0;j1 = 1;
                } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
            // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
            // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
            // c = (3-sqrt(3))/6
            var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
            var y1 = y0 - j1 + G2;
            var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
            var y2 = y0 - 1.0 + 2.0 * G2;
            // Work out the hashed gradient indices of the three simplex corners
            var ii = i & 255;
            var jj = j & 255;
            var gi0 = this.perm[ii + this.perm[jj]] % 12;
            var gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
            var gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
            // Calculate the contribution from the three corners
            var t0 = 0.5 - x0 * x0 - y0 * y0;
            if (t0 < 0) n0 = 0.0;else {
                t0 *= t0;
                n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0); // (x,y) of grad3 used for 2D gradient
            }
            var t1 = 0.5 - x1 * x1 - y1 * y1;
            if (t1 < 0) n1 = 0.0;else {
                t1 *= t1;
                n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
            }
            var t2 = 0.5 - x2 * x2 - y2 * y2;
            if (t2 < 0) n2 = 0.0;else {
                t2 *= t2;
                n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
            }
            // Add contributions from each corner to get the final noise value.
            // The result is scaled to return values in the interval [-1,1].
            return 70.0 * (n0 + n1 + n2);
        }
    }]);

    return Perlin;
}();

exports.Perlin = Perlin;

},{}]},{},[5]);
