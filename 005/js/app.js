(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\nvarying vec3 vPosition;\n\nconst float duration = 8.0;\nconst float delay = 4.0;\n\n// 3D noise\nfloat hash(float n) { return fract(sin(n) * 1e4); }\nfloat hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }\nfloat noise(vec3 x) {\n\tconst vec3 step = vec3(110, 241, 171);\n\tvec3 i = floor(x);\n\tvec3 f = fract(x);\n  float n = dot(i, step);\n\tvec3 u = f * f * (3.0 - 2.0 * f);\n\treturn mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),\n  \tmix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),\n    mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),\n    mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);\n}\n\nvoid main(){\n\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n  // float r = 0.5 + 0.5 * cos((time * 0.2) + uv.x);\n  // float g = 0.5 + 0.5 * cos((time * 0.3) + uv.y);\n  // float b = 0.5 + 0.5 * cos((time * 0.4) + uv.x);\n\n  // float r = cos((time * 0.2) + uv.y) * 0.2;\n  // float g = cos((time * 0.2) + uv.y) * 0.2;\n  // float b = cos((time * 0.2) + uv.y) * 0.2;\n  // vec3 color = vec3(r, g, b);\n  // gl_FragColor = vec4(color, 1.0);\n\n  // float now = clamp((time - delay) / duration, 0.0, 1.0);\n  // float opacity = (1.0 - length(vPosition.xy / vec2(512.0))) * 0.6 * now;\n  // vec3 v = normalize(vPosition);\n  // vec3 rgb = sin(vec3(0.5 + (v.x + v.y + v.x) / 40.0 + time * 0.1, 0.4, 1.0));\n  // gl_FragColor = vec4(rgb, opacity);\n\n  // vec3 color = vec3(noise(vPosition.xyy)) * 1.1;\n  // gl_FragColor = vec4(color, 1.0);\n\n\tgl_FragColor = vec4(0.8, 0.8, 0.8, 1.0);\n}\n";

},{}],2:[function(require,module,exports){
module.exports = "// attribute vec3 position;\n// attribute vec4 color;\n// uniform float time;\n// varying vec4 vColor;\n\nattribute vec3 m_position;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\n// attribute vec3 u_position;\n\nvarying vec3 vPosition;\n\n// varying vec3 vNormal;\n// varying vec3 vWorldPosition;\n\n//=========================\n//　　UTILS\n//=========================\n\n// normal random\n// float rand(vec2 st) {\n//   return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n// }\n\n// ===== LINEAR NOISE\n// float random (in vec2 st) {\n//   return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n// }\n//\n// float noise(vec2 st) {\n//   vec2 i = floor(st);\n//   vec2 f = fract(st);\n//   vec2 u = f*f*(3.0-2.0*f);\n//   return mix( mix( random( i + vec2(0.0,0.0) ),\n//                    random( i + vec2(1.0,0.0) ), u.x),\n//               mix( random( i + vec2(0.0,1.0) ),\n//                    random( i + vec2(1.0,1.0) ), u.x), u.y);\n// }\n//\n// mat2 rotate2d(float angle){\n//   return mat2(cos(angle),-sin(angle), sin(angle),cos(angle));\n// }\n//\n// float lines(in vec2 pos, float b){\n//   float scale = 10.0;\n//   pos *= scale;\n//   return smoothstep(0.0,.5+b*.5,abs((sin(pos.x*3.1415)+b*2.0))*.5);\n// }\n\n// ===== CLASSIC PERLIN NOISE 2D\n#define M_PI 3.14159265358979323846\n\nfloat rand (vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}\nfloat rand (vec2 co, float l) {return rand(vec2(rand(co), l));}\nfloat rand (vec2 co, float l, float t) {return rand(vec2(rand(co, l), t));}\n\nfloat perlin(vec2 p, float dim, float time) {\n\tvec2 pos = floor(p * dim);\n\tvec2 posx = pos + vec2(1.0, 0.0);\n\tvec2 posy = pos + vec2(0.0, 1.0);\n\tvec2 posxy = pos + vec2(1.0);\n\tfloat c = rand(pos, dim, time);\n\tfloat cx = rand(posx, dim, time);\n\tfloat cy = rand(posy, dim, time);\n\tfloat cxy = rand(posxy, dim, time);\n\tvec2 d = fract(p * dim);\n\td = -0.5 * cos(d * M_PI) + 0.5;\n\tfloat ccx = mix(c, cx, d.x);\n\tfloat cycxy = mix(cy, cxy, d.x);\n\tfloat center = mix(ccx, cycxy, d.y);\n\treturn center * 2.0 - 1.0;\n}\n\n//\n// // p must be normalized!\n// float perlin(vec2 p, float dim) {\n// \t/*vec2 pos = floor(p * dim);\n// \tvec2 posx = pos + vec2(1.0, 0.0);\n// \tvec2 posy = pos + vec2(0.0, 1.0);\n// \tvec2 posxy = pos + vec2(1.0);\n// \t// For exclusively black/white noise\n// \t/*float c = step(rand(pos, dim), 0.5);\n// \tfloat cx = step(rand(posx, dim), 0.5);\n// \tfloat cy = step(rand(posy, dim), 0.5);\n// \tfloat cxy = step(rand(posxy, dim), 0.5);*/\n// \t/*float c = rand(pos, dim);\n// \tfloat cx = rand(posx, dim);\n// \tfloat cy = rand(posy, dim);\n// \tfloat cxy = rand(posxy, dim);\n// \tvec2 d = fract(p * dim);\n// \td = -0.5 * cos(d * M_PI) + 0.5;\n// \tfloat ccx = mix(c, cx, d.x);\n// \tfloat cycxy = mix(cy, cxy, d.x);\n// \tfloat center = mix(ccx, cycxy, d.y);\n// \treturn center * 2.0 - 1.0;*/\n// \treturn perlin(p, dim, 0.0);\n// }\n\n//=========================\n//　　MAIN\n//=========================\n\nvoid main() {\n\n  // float sin1 = sin((position.x + position.y) * 0.2 + time * 0.5);\n  // float sin2 = sin((position.x - position.y) * 0.4 + time * 2.0);\n  // float sin3 = sin((position.x + position.y) * -0.6 + time);\n  // vec3 uv = vec3(position.x, position.y, position.z + sin1 * 50.0 + sin2 * 10.0 + sin3 * 8.0);\n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);\n\n  // float s = float(rand(position.xy)) * sin(time * 4.0) * 10.0;\n  // float s = float(sin((cnoise(position.xy) * 10.0) * (time * 0.05))) * 10.0;\n  // vec3 uv = vec3(position.x, position.y, s);\n\n  // float s1 = float(rand(position.xy)) * sin(0.5) * 30.0;\n  // float s2 = float(rand(position.xy)) * sin(2.0) * 30.0;\n  // float s3 = float(rand(position.xy)) * sin(1.0) * 30.0;\n\n  // 仮パーリン\n  // float c1 = float(cnoise(vec2(rand(position.xy)))) * 100.0;\n  // float c2 = float(cnoise(vec2(rand(position.yx)))) * 100.0;\n\n  // float c1 = float(cnoise(position.xy * sin(time * 0.0001))) * 20.0;\n  // float c2 = float(cnoise(position.yx * sin(time * 0.0001))) * 10.0;\n  // float c1 = mod((time * 0.05) * cnoise(vec2(rand(position.xy))), 1.0) * 40.0;\n  // float c2 = mod((time * 0.05) * cnoise(vec2(rand(position.yx))), 1.0) * 40.0;\n\n  // float c1 = cnoise(vec2(rand(position.xy))) * 128.0;\n  // float c2 = cnoise(vec2(rand(position.yx))) * 128.0;\n\n  // float c1 = sin(cnoise(vec2(rand(position.xy) * 5.0)) * (time * 1.0)) * 5.0;\n  // float c2 = cos(cnoise(vec2(rand(position.yx) * 5.0)) * (time * 1.0)) * 5.0;\n\n  // ===== LINEAR NOISE\n  // vec2 st = position.xy/resolution.xy;\n  // st.y *= resolution.y/resolution.x;\n  // vec2 pos = st.yx*vec2(10.,3.);\n  // float pattern1 = pos.x;\n  // float pattern2 = pos.y;\n  // pos = rotate2d(noise(pos)) * pos;\n  // pattern1 = lines(pos,.5) * 1.0;\n  // pattern2 = lines(pos,.5) * 2.0;\n  // vec3 uv = vec3(position.x, position.y, position.z + (pattern1 + pattern2) * 10.0);\n  // vPosition = position;\n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);\n\n  // ===== CLASSIC PERLIN NOISE\n  // float c1 = float(cnoise(position.xy)) * 10.0;\n  // vec3 uv = vec3(position.x, position.y, position.z + c1);\n  // vPosition = position;\n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);\n\n  //\n  float c1 = perlin(position.xy * 0.006, 6.0, 1.0) * 25.0;\n  float c2 = perlin(position.xy * 0.006, 6.0, 1.0) * 5.0;\n  vec3 uv = vec3(position.x, position.y, position.z + (c1 * c2));\n  vPosition = position;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);\n  gl_PointSize = 1.0;\n\n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";

},{}],3:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\nuniform sampler2D uTex;\nvarying vec2 vUv;\n\n// normal rad\nfloat rnd(vec2 n){\n  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n}\n\nvoid main() {\n\n  // vec2 ratio = vec2(\n  //   min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),\n  //   min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)\n  // );\n\n  vec2 ratio = vec2(\n    min((resolution.x / resolution.y) / (resolution.x / resolution.y), 1.0),\n    min((resolution.y / resolution.x) / (resolution.y / resolution.x), 1.0)\n  );\n\n  vec2 uv = vec2(\n    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,\n    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5\n  );\n\n  // vec4 color = vec4(1.0, 0.0, 1.0, 1.0);\n  // gl_FragColor = texture2D(uTex, uv) * color;\n\n  // ===== nomal rnd\n  // float r = rnd(gl_FragCoord.st + mod(time, 1.0));\n  // vec4 samplerColor = texture2D(uTex, uv);\n  // gl_FragColor = vec4(samplerColor.rgb * r, 1.0);\n\n  // ===== color dest\n  vec4 destColor = texture2D(uTex, uv);\n  // vec4 R = texture2D(uTex, uv + vec2( 0.002 * sin(mouse.x * 10.0), 0.0));\n  // vec4 G = texture2D(uTex, uv + vec2( 0.00  * cos(mouse.x * 10.0), 0.0));\n  // vec4 B = texture2D(uTex, uv + vec2(-0.002 * sin(mouse.x * 10.0), 0.0));\n  vec4 R = texture2D(uTex, uv + vec2( 0.01 * sin(floor(mouse.x)), 0.0));\n  vec4 G = texture2D(uTex, uv + vec2( 0.00  * cos(floor(mouse.x)), 0.0));\n  vec4 B = texture2D(uTex, uv + vec2(-0.01 * sin(floor(mouse.x)), 0.0));\n  gl_FragColor = vec4(vec3(R.r, G.g, B.b), 1.0);\n\n  // gl_FragColor = texture2D(uTex, uv);\n\n  // ===== tv noise\n\n}\n";

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
    var group = void 0;
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
      uniforms__POST.resolution.value.x = renderer.domElement.width;
      uniforms__POST.resolution.value.y = renderer.domElement.height;
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

      scene.rotation.y = -count * 0.001;

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
      far: 10000.0,
      x: 0.0,
      y: 0.0,
      z: 100.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0)
    };

    var RENDERER_PARAMETER = {
      clearColor: 0xffffff,
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
    scene.fog = new THREE.Fog(RENDERER_PARAMETER.clearColor, 0.01, 100);

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

    // ==================================================
    // 　　GEOMETRY
    // ==================================================

    // geometry = new THREE.SphereGeometry(100, 100, 100);
    // geometry = new THREE.PlaneBufferGeometry(2048, 1024, 32, 16);
    // geometry = new THREE.PlaneBufferGeometry(winWidth*2.0, winHeight, winWidth*0.02*2.0, winHeight*0.02);
    geometry = new THREE.PlaneBufferGeometry(2048, 2048, 512, 512);

    // geometry = new THREE.BufferGeometry();
    // let vertexPositions = [];
    // let width = 2.0;
    // let half = width / 2.0;
    // let interval = 0.2;
    // let points = width / interval;
    // for(var i = 0; i <= points; ++i){
    //   let x = -half + i * interval;
    //   for(var j = 0; j <= points; ++j){
    //     let y = -half + j * interval;
    //     vertexPositions.push([x, y, 0.0]);
    //   }
    // }
    // let vertices = new Float32Array(vertexPositions.length * 3);
    // for (var i = 0; i < vertexPositions.length; i++) {
    //   vertices[i * 3 + 0] = vertexPositions[i][0];
    //   vertices[i * 3 + 1] = vertexPositions[i][1];
    //   vertices[i * 3 + 2] = vertexPositions[i][2];
    // }
    // geometry.addAttribute('u_position',
    //   new THREE.BufferAttribute(vertices, 3)
    // );

    // let vertexIndices = [];
    // for (var i = 0; i < 6 * 18; i++) {
    //   if(
    //     i != 10 &&
    //     i != 21 &&
    //     i != 32 &&
    //     i != 43 &&
    //     i != 54 &&
    //     i != 65 &&
    //     i != 76 &&
    //     i != 87 &&
    //     i != 98
    //   ) {
    //     if(i < 107) {
    //       vertexIndices.push(
    //         i,  1 + i, 12 + i,
    //         i, 11 + i, 12 + i
    //       );
    //     } else {
    //       vertexIndices.push(
    //         i,  1 + i, 12 + i,
    //         i, 11 + i, 12 + i,
    //         1 + i,  2 + i, 13 + i,
    //         1 + i, 12 + i, 13 + i
    //       );
    //     }
    //   }
    // }

    // let indices = new Uint16Array(vertexIndices);

    // geometry.addAttribute('u_position',
    //   new THREE.BufferAttribute(geometry.attributes.position.array, 3)
    // );

    // geometry.addAttribute('index',
    //   new THREE.BufferAttribute(indices, 1)
    // );

    // ==================================================
    // 　　MATERIAL
    // ==================================================

    // material = new THREE.MeshLambertMaterial({
    //   color: 0xff0000,
    //   side: THREE.DoubleSide
    // });

    // let phongShader = THREE.ShaderLib.phong;
    // material = new THREE.ShaderMaterial({
    //   uniforms: THREE.UniformsUtils.clone(phongShader.uniforms),
    //   vertexShader: phongShader.vertexShader,
    //   fragmentShader: phongShader.fragmentShader,
    //   lights: true,
    //   fog: true
    // });

    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: mainVert,
      fragmentShader: mainFrag,
      transparent: true,
      wireframe: true,
      depthWrite: true,
      // fog: true,
      side: THREE.DoubleSide
    });

    // ==================================================
    // 　　LIGHT
    // ==================================================

    // directional = new THREE.DirectionalLight(0xffffff);
    // directional.position.set(500, 500, 500);
    // // directional.shadowCameraVisible = true;
    // // directional.castShadow = true;
    // scene.add(directional);
    //
    // ambient = new THREE.AmbientLight(0xffffff, 0.2);
    // // ambient.shadowCameraVisible = true;
    // // ambient.castShadow = true;
    // scene.add(ambient);

    // ==================================================
    // 　　MESH / GROUP
    // ==================================================

    mesh = new THREE.Points(geometry, material);
    // mesh.castShadow = true;
    // mesh.rotation.x = -1.0;

    // ===== perlin noise on javascript
    // let perlin = new Perlin();
    // let peak = 60;
    // let smoothing = 300;
    // let vertices = mesh.geometry.attributes.position.array;
    // for (var i = 0; i <= vertices.length; i += 3) {
    //   vertices[i+2] = peak * perlin.noise(
    //     (mesh.position.x + vertices[i] * (Math.random() * (1.0 - 0.98) + 0.98)) / (smoothing),
    //     (mesh.position.z + vertices[i+1] * (Math.random() * (1.0 - 0.98) + 0.98)) / (smoothing)
    //   );
    // }
    // mesh.geometry.attributes.position.needsUpdate = true;
    // mesh.geometry.computeVertexNormals();
    //
    // //
    // geometry.addAttribute('m_position',
    //   new THREE.BufferAttribute(vertices, 3)
    // );

    mesh.position.y = -200.0;
    mesh.rotation.x = -Math.PI * 0.5;

    // group = new THREE.Group();
    // group.add(mesh);

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
