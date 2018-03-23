(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\nvarying vec3 vPosition;\n\nconst float duration = 8.0;\nconst float delay = 4.0;\n\n// 3D noise\nfloat hash(float n) { return fract(sin(n) * 1e4); }\nfloat hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }\nfloat noise(vec3 x) {\n\tconst vec3 step = vec3(110, 241, 171);\n\tvec3 i = floor(x);\n\tvec3 f = fract(x);\n  float n = dot(i, step);\n\tvec3 u = f * f * (3.0 - 2.0 * f);\n\treturn mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),\n  \tmix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),\n    mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),\n    mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);\n}\n\nvoid main(){\n\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n  // float r = 0.5 + 0.5 * cos((time * 0.2) + uv.x);\n  // float g = 0.5 + 0.5 * cos((time * 0.3) + uv.y);\n  // float b = 0.5 + 0.5 * cos((time * 0.4) + uv.x);\n\n  // float r = cos((time * 0.2) + uv.y) * 0.2;\n  // float g = cos((time * 0.2) + uv.y) * 0.2;\n  // float b = cos((time * 0.2) + uv.y) * 0.2;\n  // vec3 color = vec3(r, g, b);\n  // gl_FragColor = vec4(color, 1.0);\n\n  // float now = clamp((time - delay) / duration, 0.0, 1.0);\n  // float opacity = (1.0 - length(vPosition.xy / vec2(512.0))) * 0.6 * now;\n  // vec3 v = normalize(vPosition);\n  // vec3 rgb = sin(vec3(0.5 + (v.x + v.y + v.x) / 40.0 + time * 0.1, 0.4, 1.0));\n  // gl_FragColor = vec4(rgb, opacity);\n\n  // vec3 color = vec3(noise(vPosition.xyy)) * 1.1;\n  // gl_FragColor = vec4(color, 1.0);\n\n\tgl_FragColor = vec4(0.8, 0.8, 0.8, 1.0);\n}\n";

},{}],2:[function(require,module,exports){
module.exports = "// attribute vec3 position;\n// attribute vec4 color;\n// uniform float time;\n// varying vec4 vColor;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\n// attribute vec3 u_position;\n\nvarying vec3 vPosition;\n\n// varying vec3 vNormal;\n// varying vec3 vWorldPosition;\n\n//=========================\n//　　UTILS\n//=========================\n\n// normal random\nfloat rand(vec2 st) {\n  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n}\n\n// 2D perlin noise\nvec4 permute(vec4 x){\n  return mod(((x*34.0)+1.0)*x, 289.0);\n}\n\nvec4 taylorInvSqrt(vec4 r){\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec2 fade(vec2 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\nfloat cnoise(vec2 P){\n\n  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);\n  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);\n\n  Pi = mod(Pi, 289.0);\n\n  // vec4 ix = Pi.xzxz;\n  // vec4 iy = Pi.yyww;\n  // vec4 fx = Pf.xzxz;\n  // vec4 fy = Pf.yyww;\n  vec4 ix = Pi.xyxy;\n  vec4 iy = Pi.zzww;\n  vec4 fx = Pf.xyxy;\n  vec4 fy = Pf.zzww;\n\n  vec4 i = permute(permute(ix) + iy);\n  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;\n  vec4 gy = abs(gx) - 0.5;\n  vec4 tx = floor(gx + 0.5);\n  gx = gx - tx;\n\n  // vec2 g00 = vec2(gx.x,gy.x);\n  // vec2 g10 = vec2(gx.y,gy.y);\n  // vec2 g01 = vec2(gx.z,gy.z);\n  // vec2 g11 = vec2(gx.w,gy.w);\n  vec2 g00 = vec2(gx.x,gy.x);\n  vec2 g10 = vec2(gx.z,gy.z);\n  vec2 g01 = vec2(gx.y,gy.y);\n  vec2 g11 = vec2(gx.w,gy.w);\n\n  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));\n\n  g00 *= norm.x;\n  g01 *= norm.y;\n  g10 *= norm.z;\n  g11 *= norm.w;\n  float n00 = dot(g00, vec2(fx.x, fy.x));\n  float n10 = dot(g10, vec2(fx.y, fy.y));\n  float n01 = dot(g01, vec2(fx.z, fy.z));\n  float n11 = dot(g11, vec2(fx.w, fy.w));\n  vec2 fade_xy = fade(Pf.xy);\n  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);\n  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);\n\n  return 2.3 * n_xy;\n}\n\n//=========================\n//　　MAIN\n//=========================\n\nvoid main() {\n\n  // float sin1 = sin((position.x + position.y) * 0.2 + time * 0.5);\n  // float sin2 = sin((position.x - position.y) * 0.4 + time * 2.0);\n  // float sin3 = sin((position.x + position.y) * -0.6 + time);\n  // vec3 uv = vec3(position.x, position.y, position.z + sin1 * 50.0 + sin2 * 10.0 + sin3 * 8.0);\n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);\n\n  // float s = float(rand(position.xy)) * sin(time * 4.0) * 10.0;\n  // float s = float(sin((cnoise(position.xy) * 10.0) * (time * 0.05))) * 10.0;\n  // vec3 uv = vec3(position.x, position.y, s);\n\n  // float s1 = float(rand(position.xy)) * sin(0.5) * 30.0;\n  // float s2 = float(rand(position.xy)) * sin(2.0) * 30.0;\n  // float s3 = float(rand(position.xy)) * sin(1.0) * 30.0;\n\n  // 仮パーリン\n  // float c1 = float(cnoise(vec2(rand(position.xy)))) * 100.0;\n  // float c2 = float(cnoise(vec2(rand(position.yx)))) * 100.0;\n\n  // float c1 = float(cnoise(position.xy * sin(time * 0.0001))) * 20.0;\n  // float c2 = float(cnoise(position.yx * sin(time * 0.0001))) * 10.0;\n  // float c1 = mod((time * 0.05) * cnoise(vec2(rand(position.xy))), 1.0) * 40.0;\n  // float c2 = mod((time * 0.05) * cnoise(vec2(rand(position.yx))), 1.0) * 40.0;\n\n  // float c1 = cnoise(vec2(rand(position.xy))) * 128.0;\n  // float c2 = cnoise(vec2(rand(position.yx))) * 128.0;\n\n  float c1 = sin(cnoise(vec2(rand(position.xy) * 5.0)) * (time * 1.0)) * 5.0;\n  float c2 = cos(cnoise(vec2(rand(position.yx) * 5.0)) * (time * 1.0)) * 5.0;\n\n  // float s1 = float(cnoise(position.xx)) * sin(0.5) * 30.0;\n  // float s2 = float(cnoise(position.yy)) * sin(2.0) * 30.0;\n  // float s3 = float(cnoise(position.xy)) * sin(1.0) * 30.0;\n\n  vec3 uv = vec3(position.x, position.y, c1 + c2);\n  vPosition = position;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);\n\n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n}\n";

},{}],3:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\nuniform sampler2D uTex;\nvarying vec2 vUv;\n\n// normal rad\nfloat rnd(vec2 n){\n  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n}\n\nvoid main() {\n\n  // vec2 ratio = vec2(\n  //   min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),\n  //   min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)\n  // );\n\n  vec2 ratio = vec2(\n    min((resolution.x / resolution.y) / (resolution.x / resolution.y), 1.0),\n    min((resolution.y / resolution.x) / (resolution.y / resolution.x), 1.0)\n  );\n\n  vec2 uv = vec2(\n    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,\n    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5\n  );\n\n  // vec4 color = vec4(1.0, 0.0, 1.0, 1.0);\n  // gl_FragColor = texture2D(uTex, uv) * color;\n\n  // ===== nomal rnd\n  // float r = rnd(gl_FragCoord.st + mod(time, 1.0));\n  // vec4 samplerColor = texture2D(uTex, uv);\n  // gl_FragColor = vec4(samplerColor.rgb * r, 1.0);\n\n  // ===== color dest\n  vec4 destColor = texture2D(uTex, uv);\n  // vec4 R = texture2D(uTex, uv + vec2( 0.002 * sin(mouse.x * 10.0), 0.0));\n  // vec4 G = texture2D(uTex, uv + vec2( 0.00  * cos(mouse.x * 10.0), 0.0));\n  // vec4 B = texture2D(uTex, uv + vec2(-0.002 * sin(mouse.x * 10.0), 0.0));\n  vec4 R = texture2D(uTex, uv + vec2( 0.003 * sin(floor(mouse.x)), 0.0));\n  vec4 G = texture2D(uTex, uv + vec2( 0.00  * cos(floor(mouse.x)), 0.0));\n  vec4 B = texture2D(uTex, uv + vec2(-0.003 * sin(floor(mouse.x)), 0.0));\n  gl_FragColor = vec4(vec3(R.r, G.g, B.b), 1.0);\n\n  // gl_FragColor = texture2D(uTex, uv);\n\n  // ===== tv noise\n\n}\n";

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

    // controls = new THREE.OrbitControls(camera);

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
        // value: 1.0
      }
    };

    // ==================================================
    // 　　GEOMETRY
    // ==================================================

    // geometry = new THREE.SphereGeometry(100, 100, 100);
    // geometry = new THREE.PlaneBufferGeometry(2048, 1024, 32, 16);
    // geometry = new THREE.PlaneBufferGeometry(winWidth*2.0, winHeight, winWidth*0.02*2.0, winHeight*0.02);
    geometry = new THREE.PlaneBufferGeometry(1024, 1024, 64, 64);

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

    mesh = new THREE.Mesh(geometry, material);
    // mesh.castShadow = true;
    // mesh.rotation.x = -1.0;
    mesh.position.y = -10.0;
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

},{"./../_shader/main.frag":1,"./../_shader/main.vert":2,"./../_shader/post.frag":3,"./../_shader/post.vert":4}]},{},[5]);
