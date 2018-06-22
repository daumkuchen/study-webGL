(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\nvarying vec4  vColor;\nvarying float fogFactor;\n// varying vec3 vPosition;\n\nvoid main(){\n\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n\t// ===== FOG\n  vec3 color = 0.5 + 0.5 * cos(time + uv.xyx + vec3(0, 2, 4));\n\tgl_FragColor = mix(vec4(color, 1.0), vColor, fogFactor);\n\n\t// ===== DEFAULT\n\t// gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}\n";

},{}],2:[function(require,module,exports){
module.exports = "// attribute vec3 position;\n// attribute vec4 color;\n// uniform float time;\n// varying vec4 vColor;\n\n// attribute vec3 position;\n// attribute vec3 normal;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\n// attribute vec3 u_position;\n\nvarying vec4  vColor;\nvarying float fogFactor;\n// varying vec3 vPosition;\n// varying vec3 vNormal;\n// varying vec3 vWorldPosition;\n\n//=========================\n//　　UTILS\n//=========================\n\n// normal random\nfloat rnd(vec2 st) {\n  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n}\n\n// ===== CLASSIC PERLIN NOISE 2D\n#define M_PI 3.14159265358979323846\nfloat rand (vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}\nfloat rand (vec2 co, float l) {return rand(vec2(rand(co), l));}\nfloat rand (vec2 co, float l, float t) {return rand(vec2(rand(co, l), t));}\nfloat perlin(vec2 p, float dim, float time) {\n\tvec2 pos = floor(p * dim);\n\tvec2 posx = pos + vec2(1.0, 0.0);\n\tvec2 posy = pos + vec2(0.0, 1.0);\n\tvec2 posxy = pos + vec2(1.0);\n\tfloat c = rand(pos, dim, time);\n\tfloat cx = rand(posx, dim, time);\n\tfloat cy = rand(posy, dim, time);\n\tfloat cxy = rand(posxy, dim, time);\n\tvec2 d = fract(p * dim);\n\td = -0.5 * cos(d * M_PI) + 0.5;\n\tfloat ccx = mix(c, cx, d.x);\n\tfloat cycxy = mix(cy, cxy, d.x);\n\tfloat center = mix(ccx, cycxy, d.y);\n\treturn center * 2.0 - 1.0;\n}\n\n// ===== PROCESSING NOISE\nvec3 mod289(vec3 x) {\n\treturn x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x) {\n\treturn x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x) {\n\treturn mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r) {\n\treturn 1.79284291400159 - 0.85373472095314 * r;\n}\nvec3 fade(vec3 t) {\n\treturn t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\nfloat noise(vec3 P) {\n\tvec3 Pi0 = floor(P),\n\t\tPi1 = Pi0 + vec3(1.0);\n\t  Pi0 = mod289(Pi0);\n\t  Pi1 = mod289(Pi1);\n\tvec3 Pf0 = fract(P),\n\t\tPf1 = Pf0 - vec3(1.0);\n\tvec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x),\n\t\tiy = vec4(Pi0.yy, Pi1.yy),\n\t\tiz0 = Pi0.zzzz,\n\t\tiz1 = Pi1.zzzz,\n\t\tixy = permute(permute(ix) + iy),\n\t\tixy0 = permute(ixy + iz0),\n\t\tixy1 = permute(ixy + iz1),\n\t\tgx0 = ixy0 * (1.0 / 7.0),\n\t\tgy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n\tgx0 = fract(gx0);\n\tvec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0),\n\t\tsz0 = step(gz0, vec4(0.0));\n\tgx0 -= sz0 * (step(0.0, gx0) - 0.5);\n\tgy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\tvec4 gx1 = ixy1 * (1.0 / 7.0),\n\t\tgy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n\tgx1 = fract(gx1);\n\tvec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1),\n\t\tsz1 = step(gz1, vec4(0.0));\n\tgx1 -= sz1 * (step(0.0, gx1) - 0.5);\n\tgy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\tvec3 g000 = vec3(gx0.x, gy0.x, gz0.x),\n\t\tg100 = vec3(gx0.y, gy0.y, gz0.y),\n\t\tg010 = vec3(gx0.z, gy0.z, gz0.z),\n\t\tg110 = vec3(gx0.w, gy0.w, gz0.w),\n\t\tg001 = vec3(gx1.x, gy1.x, gz1.x),\n\t\tg101 = vec3(gx1.y, gy1.y, gz1.y),\n\t\tg011 = vec3(gx1.z, gy1.z, gz1.z),\n\t\tg111 = vec3(gx1.w, gy1.w, gz1.w);\n\tvec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n\tg000 *= norm0.x;\n\tg010 *= norm0.y;\n\tg100 *= norm0.z;\n\tg110 *= norm0.w;\n\tvec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n\tg001 *= norm1.x;\n\tg011 *= norm1.y;\n\tg101 *= norm1.z;\n\tg111 *= norm1.w;\n\tfloat n000 = dot(g000, Pf0),\n\t\tn100 = dot(g100, vec3(Pf1.x, Pf0.yz)),\n\t\tn010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z)),\n\t\tn110 = dot(g110, vec3(Pf1.xy, Pf0.z)),\n\t\tn001 = dot(g001, vec3(Pf0.xy, Pf1.z)),\n\t\tn101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z)),\n\t\tn011 = dot(g011, vec3(Pf0.x, Pf1.yz)),\n\t\tn111 = dot(g111, Pf1);\n\tvec3 fade_xyz = fade(Pf0);\n\tvec4 n_z = mix(vec4(n000, n100, n010, n110),\n\t\tvec4(n001, n101, n011, n111), fade_xyz.z);\n\tvec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n\treturn mix(n_yz.x, n_yz.y, fade_xyz.x);\n}\n\n//=========================\n//　　MAIN\n//=========================\n\nvoid main() {\n\n  // とりあえず膨らむ\n  // float p = abs(rnd(vec2(normal.zz)) * sin(time * 0.2) * 0.8);\n\t// vec3 uv = vec3(position + (normal * p));\n\n  // perlinで膨らむ\n  // float offX = abs(perlin(vec2(normal.yz), 5.0, 5.0) * sin(time * 0.5) * 0.3);\n  // float offY = abs(perlin(vec2(normal.xz), 5.0, 5.0) * sin(time * 0.5) * 0.3);\n  // float offZ = abs(perlin(vec2(normal.xy), 5.0, 5.0) * sin(time * 0.5) * 0.3);\n  // vec3 uv = vec3(\n  //   position.x + (normal.x * offX),\n  //   position.y + (normal.y * offY),\n  //   position.z + (normal.z * offZ)\n  // );\n\n  // 控えめにぐにゃぐにゃする\n  float offX = abs(perlin(vec2(normal.yz) * 1.2 * sin(time * 4.0), 1.0, 0.001));\n  float offY = abs(perlin(vec2(normal.xz) * 1.2 * cos(time * 2.0), 1.0, 0.001));\n  float offZ = abs(perlin(vec2(normal.xy) * 1.2 * sin(time * 3.0), 1.0, 0.001));\n  vec3 uv = vec3(\n    position.x + (normal.x * offX),\n    position.y + (normal.y * offY),\n    position.z + (normal.z * offZ)\n  );\n\n  // ===== PROCESSING NOISE\n  // float n = noise(vec3(position.x * 100.0, position.y * 100.0, 1.0));\n  // vec3 uv = vec3(position.x, position.y, position.z + n);\n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);\n\n\t// ===== FOG\n\tconst float near = 0.1;\n\tconst float far  = 50.0;\n\tconst float linerDepth = 1.0 / (far - near);\n\tconst vec4 lightDirection = vec4(0.0, 10.0, 0.0, 1.0);\n\tconst vec4 color = vec4(0.0, 0.0, 0.0, 1.0);\n\tconst float fogStart = -10.0;\n\tconst float fogEnd = 10.0;\n\n\tvec3 invLight = normalize(viewMatrix * lightDirection).xyz;\n\tvec3 invEye = normalize(viewMatrix * vec4(cameraPosition, 0.0)).xyz;\n\tvec3 halfLE = normalize(invLight + invEye);\n\tfloat diffuse = clamp(dot(normal, invLight), 0.1, 1.0);\n\tfloat specular = pow(clamp(dot(normal, halfLE), 0.0, 1.0), 50.0);\n\tvec4 amb = color * color;\n\tvColor = amb * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0);\n\tvec3 pos = (modelMatrix * vec4(position, 1.0)).xyz;\n\tfloat linerPos = length(cameraPosition - pos) * linerDepth;\n\tfogFactor = clamp((fogEnd - linerPos) / (fogEnd - fogStart), 0.0, 1.0);\n\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);\n\n\t// vPosition = position;\n  // gl_PointSize = 1.0;\n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";

},{}],3:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\nuniform sampler2D uTex;\nvarying vec2 vUv;\n\n// normal rad\nfloat rnd(vec2 n){\n  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n}\n\nvoid main() {\n\n  // vec2 ratio = vec2(\n  //   min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),\n  //   min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)\n  // );\n\n  vec2 ratio = vec2(\n    min((resolution.x / resolution.y) / (resolution.x / resolution.y), 1.0),\n    min((resolution.y / resolution.x) / (resolution.y / resolution.x), 1.0)\n  );\n\n  vec2 uv = vec2(\n    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,\n    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5\n  );\n\n  // vec4 color = vec4(1.0, 0.0, 1.0, 1.0);\n  // gl_FragColor = texture2D(uTex, uv) * color;\n\n  // ===== nomal rnd\n  // float r = rnd(gl_FragCoord.st + mod(time, 1.0));\n  // vec4 samplerColor = texture2D(uTex, uv);\n  // gl_FragColor = vec4(samplerColor.rgb * r, 1.0);\n\n  // ===== color dest\n  // vec4 destColor = texture2D(uTex, uv);\n  // vec4 R = texture2D(uTex, uv + vec2( 0.01, 0.0));\n  // vec4 G = texture2D(uTex, uv + vec2( 0.00, 0.0));\n  // vec4 B = texture2D(uTex, uv + vec2(-0.01, 0.0));\n  // gl_FragColor = vec4(vec3(R.r, G.g, B.b), 1.0);\n\n  // ===== default\n  gl_FragColor = texture2D(uTex, uv);\n}\n";

},{}],4:[function(require,module,exports){
module.exports = "varying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = vec4(position, 1.0);\n}\n";

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

    var renderer = void 0;
    var scene = void 0;
    var camera = void 0;
    var uniforms = void 0;
    var geometry = void 0;
    var material = void 0;
    var mesh = void 0;
    var floor = void 0;

    // light
    var directional = void 0;
    var ambient = void 0;
    var hemisphere = void 0;
    var point = void 0;
    var spot = void 0;

    var renderer__POST = void 0;
    var scene__POST = void 0;
    var camera__POST = void 0;
    var uniforms__POST = void 0;
    var geometry__POST = void 0;
    var material__POST = void 0;
    var mesh__POST = void 0;

    var controls = void 0;
    var loader = void 0;

    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;
    var targetDOM = document.getElementById('canvas');
    targetDOM.width *= devicePixelRatio;
    targetDOM.height *= devicePixelRatio;
    targetDOM.style.width = String(targetDOM.width / devicePixelRatio) + 'px';

    // ==================================================
    // 　　MOUSE
    // ==================================================

    window.addEventListener('mousemove', function (e) {
      var x = event.clientX * 2.0 - winWidth;
      var y = event.clientY * 2.0 - winHeight;
      x /= winWidth;
      y /= winHeight;
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

      // mesh.rotation.x = count * 0.02;
      mesh.rotation.y = count * 0.02;

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
      z: 5.0,
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

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(winWidth, winHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    targetDOM.appendChild(renderer.domElement);

    var CameraController = function CameraController(theta, phi, radius) {
      this.name = "Camera Controller";
      this.theta = theta;
      this.phi = phi;
      this.radius = radius;

      this.update = function (refCamera) {
        refCamera.position.x = this.radius * Math.sin(this.theta * Math.PI / 180.0) * Math.cos(this.phi * Math.PI / 180.0);
        refCamera.position.y = this.radius * Math.cos(this.theta * Math.PI / 180.0);
        refCamera.position.z = this.radius * Math.sin(this.theta * Math.PI / 180.0) * Math.sin(this.phi * Math.PI / 180.0);
        refCamera.lookAt({ x: 0, y: 0, z: 0 });
      };
    };

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // ==================================================
    // 　　GUI
    // ==================================================

    // sphere
    var sphere = new function () {
      this.radius = 16.0;
      this.color = 0xffffff;
    }();

    var light = new function () {
      this.ambientColor = 0xffffff;
      this.directionalColor = 0xffffff;
      this.hemisphereColor = 0xffffff;
      this.pointColor = 0xffffff;
      this.spotColor = 0xffffff;
    }();

    // gui
    var gui = new dat.GUI();

    // guiSphere
    var guiSphere = gui.addFolder('sphere');

    guiSphere.add(sphere, 'radius', 8.0, 256.0).onChange(function (value) {
      mesh.geometry = new THREE.SphereGeometry(1.0, value, value);
      // mesh.position.y = value * 0.5;
    });

    guiSphere.addColor(sphere, 'color').onChange(function (value) {
      mesh.material.color.setHex(value);
    });

    guiSphere.open();

    // guiLight
    var guiLight = gui.addFolder('light');

    guiLight.addColor(light, 'ambientColor').onChange(function (value) {
      ambient.color.setHex(value);
    });

    guiLight.addColor(light, 'directionalColor').onChange(function (value) {
      directional.color.setHex(value);
    });

    guiLight.addColor(light, 'hemisphereColor').onChange(function (value) {
      hemisphere.color.setHex(value);
    });

    guiLight.addColor(light, 'pointColor').onChange(function (value) {
      point.color.setHex(value);
    });

    guiLight.addColor(light, 'spotColor').onChange(function (value) {
      spot.color.setHex(value);
    });

    guiLight.open();

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

    // geometry = new THREE.SphereGeometry(1.0, 128.0, 128.0);
    // geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    geometry = new THREE.SphereGeometry(1.0, 16.0, 16.0);

    // ==================================================
    // 　　MATERIAL
    // ==================================================

    material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading,
      roughness: 0.1,
      metalness: 0.9
    });

    // ==================================================
    // 　　LIGHT
    // ==================================================

    // 環境光源（全体に均一に当たる）
    ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);

    // 平行光源（光源から平行に当たる）
    directional = new THREE.DirectionalLight(0xffffff);
    directional.position.set(20.0, 20.0, 20.0);
    directional.castShadow = true;
    directional.shadow.mapSize.width = 1024;
    directional.shadow.mapSize.height = 1024;
    directional.shadow.camera.near = 0.01;
    directional.shadow.camera.far = 500;
    scene.add(directional);

    // 半休光源（自然光のような柔らかい当たり方）
    hemisphere = new THREE.HemisphereLight(0xffffff, 0x000000, 0.2);
    hemisphere.position.set(20.0, 20.0, 20.0);
    scene.add(hemisphere);

    // 点光源（光源から全方位に拡散する）
    point = new THREE.PointLight(0xffffff, 1.0, 10.0);
    point.position.set(20.0, 20.0, 20.0);
    scene.add(point);

    // スポットライト（一点に当たる）
    spot = new THREE.SpotLight(0xffffff);
    spot.position.set(0.0, 7.5, 0.0);
    scene.add(spot);

    // ==================================================
    // 　　MESH / GROUP
    // ==================================================

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.5;
    // mesh.rotation.x =  Math.PI * 0.2;
    // mesh.rotation.y = -Math.PI * 0.2;
    mesh.castShadow = true;
    scene.add(mesh);

    floor = new THREE.Mesh(new THREE.PlaneGeometry(50.0, 50.0, 32.0),
    // new THREE.MeshPhongMaterial({
    new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    }));
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = -1.0;
    floor.receiveShadow = true;
    scene.add(floor);

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

},{"./../_shader/main.frag":1,"./../_shader/main.vert":2,"./../_shader/post.frag":3,"./../_shader/post.vert":4}]},{},[5]);
