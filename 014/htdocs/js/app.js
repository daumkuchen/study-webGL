(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = "// attribute vec3 position;\n// attribute vec4 color;\n// uniform float time;\n// varying vec4 vColor;\n\nattribute vec3 m_position;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\n// attribute vec3 u_position;\n\nvarying vec4  vColor;\nvarying float fogFactor;\n// varying vec3 vPosition;\n// varying vec3 vNormal;\n// varying vec3 vWorldPosition;\n\n//=========================\n//　　UTILS\n//=========================\n\n// normal random\nfloat rnd(vec2 st) {\n  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n}\n\n// ===== CLASSIC PERLIN NOISE 2D\n#define M_PI 3.14159265358979323846\nfloat rand (vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}\nfloat rand (vec2 co, float l) {return rand(vec2(rand(co), l));}\nfloat rand (vec2 co, float l, float t) {return rand(vec2(rand(co, l), t));}\nfloat perlin(vec2 p, float dim, float time) {\n\tvec2 pos = floor(p * dim);\n\tvec2 posx = pos + vec2(1.0, 0.0);\n\tvec2 posy = pos + vec2(0.0, 1.0);\n\tvec2 posxy = pos + vec2(1.0);\n\tfloat c = rand(pos, dim, time);\n\tfloat cx = rand(posx, dim, time);\n\tfloat cy = rand(posy, dim, time);\n\tfloat cxy = rand(posxy, dim, time);\n\tvec2 d = fract(p * dim);\n\td = -0.5 * cos(d * M_PI) + 0.5;\n\tfloat ccx = mix(c, cx, d.x);\n\tfloat cycxy = mix(cy, cxy, d.x);\n\tfloat center = mix(ccx, cycxy, d.y);\n\treturn center * 2.0 - 1.0;\n}\n\n// ===== PROCESSING NOISE\nvec3 mod289(vec3 x) {\n\treturn x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x) {\n\treturn x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x) {\n\treturn mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r) {\n\treturn 1.79284291400159 - 0.85373472095314 * r;\n}\nvec3 fade(vec3 t) {\n\treturn t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\nfloat noise(vec3 P) {\n\tvec3 Pi0 = floor(P),\n\t\tPi1 = Pi0 + vec3(1.0);\n\tPi0 = mod289(Pi0);\n\tPi1 = mod289(Pi1);\n\tvec3 Pf0 = fract(P),\n\t\tPf1 = Pf0 - vec3(1.0);\n\tvec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x),\n\t\tiy = vec4(Pi0.yy, Pi1.yy),\n\t\tiz0 = Pi0.zzzz,\n\t\tiz1 = Pi1.zzzz,\n\t\tixy = permute(permute(ix) + iy),\n\t\tixy0 = permute(ixy + iz0),\n\t\tixy1 = permute(ixy + iz1),\n\t\tgx0 = ixy0 * (1.0 / 7.0),\n\t\tgy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n\tgx0 = fract(gx0);\n\tvec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0),\n\t\tsz0 = step(gz0, vec4(0.0));\n\tgx0 -= sz0 * (step(0.0, gx0) - 0.5);\n\tgy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\tvec4 gx1 = ixy1 * (1.0 / 7.0),\n\t\tgy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n\tgx1 = fract(gx1);\n\tvec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1),\n\t\tsz1 = step(gz1, vec4(0.0));\n\tgx1 -= sz1 * (step(0.0, gx1) - 0.5);\n\tgy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\tvec3 g000 = vec3(gx0.x, gy0.x, gz0.x),\n\t\tg100 = vec3(gx0.y, gy0.y, gz0.y),\n\t\tg010 = vec3(gx0.z, gy0.z, gz0.z),\n\t\tg110 = vec3(gx0.w, gy0.w, gz0.w),\n\t\tg001 = vec3(gx1.x, gy1.x, gz1.x),\n\t\tg101 = vec3(gx1.y, gy1.y, gz1.y),\n\t\tg011 = vec3(gx1.z, gy1.z, gz1.z),\n\t\tg111 = vec3(gx1.w, gy1.w, gz1.w);\n\tvec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n\tg000 *= norm0.x;\n\tg010 *= norm0.y;\n\tg100 *= norm0.z;\n\tg110 *= norm0.w;\n\tvec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n\tg001 *= norm1.x;\n\tg011 *= norm1.y;\n\tg101 *= norm1.z;\n\tg111 *= norm1.w;\n\tfloat n000 = dot(g000, Pf0),\n\t\tn100 = dot(g100, vec3(Pf1.x, Pf0.yz)),\n\t\tn010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z)),\n\t\tn110 = dot(g110, vec3(Pf1.xy, Pf0.z)),\n\t\tn001 = dot(g001, vec3(Pf0.xy, Pf1.z)),\n\t\tn101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z)),\n\t\tn011 = dot(g011, vec3(Pf0.x, Pf1.yz)),\n\t\tn111 = dot(g111, Pf1);\n\tvec3 fade_xyz = fade(Pf0);\n\tvec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n\tvec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n\treturn mix(n_yz.x, n_yz.y, fade_xyz.x);\n}\n\n//=========================\n//　　MAIN\n//=========================\n\nvoid main() {\n\n  float p = perlin(vec2(position.x * 0.008, position.y * 0.008 + (time * 0.5)), 0.8, 0.8) * 50.0;\n\tvec3 uv = vec3(position.x, position.y, position.z + p);\n\n\t// ===== PROCESSING NOISE\n\t// float p = noise(vec3(position.xyz) * 100.0);\n  // vec3 uv = vec3(position.x, position.y, position.z + p);\n\n\t// ===== FOG\n\tconst float near = 0.1;\n\tconst float far  = 30.0;\n\tconst float linerDepth = 1.0 / (far - near);\n\tconst vec4 lightDirection = vec4(0.0, 10.0, 0.0, 1.0);\n\tconst vec4 color = vec4(1.0, 1.0, 1.0, 1.0);\n\tconst float fogStart = -80.0;\n\tconst float fogEnd = 40.0;\n\n\tvec3 invLight = normalize(viewMatrix * lightDirection).xyz;\n\tvec3 invEye = normalize(viewMatrix * vec4(cameraPosition, 0.0)).xyz;\n\tvec3 halfLE = normalize(invLight + invEye);\n\tfloat diffuse = clamp(dot(normal, invLight), 0.1, 1.0);\n\tfloat specular = pow(clamp(dot(normal, halfLE), 0.0, 1.0), 50.0);\n\tvec4 amb = color * color;\n\tvColor = amb * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0);\n\tvec3 pos = (modelMatrix * vec4(position, 1.0)).xyz;\n\tfloat linerPos = length(cameraPosition - pos) * linerDepth;\n\tfogFactor = clamp((fogEnd - linerPos) / (fogEnd - fogStart), 0.0, 1.0);\n\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);\n\n\t// vPosition = position;\n  // gl_PointSize = 1.0;\n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";

},{}],2:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\nvarying vec4  vColor;\nvarying float fogFactor;\n// varying vec3 vPosition;\n\nvoid main(){\n\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n\t// ===== FOG\n\t// gl_FragColor = mix(vec4(1.0, 1.0, 1.0, 1.0), vColor, fogFactor);\n\n\t// ===== DEFAULT\n\tgl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}\n";

},{}],3:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\nvarying vec4  vColor;\nvarying float fogFactor;\n// varying vec3 vPosition;\n\nvoid main(){\n\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n\t// ===== FOG\n\t// gl_FragColor = mix(vec4(1.0, 1.0, 1.0, 1.0), vColor, fogFactor);\n\n\t// ===== DEFAULT\n\tgl_FragColor = vec4(0.8, 0.8, 0.8, 1.0);\n}\n";

},{}],4:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\nuniform sampler2D uTex;\nvarying vec2 vUv;\n\n// normal rad\nfloat rnd(vec2 n){\n  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n}\n\nvoid main() {\n\n  // vec2 ratio = vec2(\n  //   min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),\n  //   min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)\n  // );\n\n  vec2 ratio = vec2(\n    min((resolution.x / resolution.y) / (resolution.x / resolution.y), 1.0),\n    min((resolution.y / resolution.x) / (resolution.y / resolution.x), 1.0)\n  );\n\n  vec2 uv = vec2(\n    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,\n    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5\n  );\n\n  // vec4 color = vec4(1.0, 0.0, 1.0, 1.0);\n  // gl_FragColor = texture2D(uTex, uv) * color;\n\n  // ===== nomal rnd\n  // float r = rnd(gl_FragCoord.st + mod(time, 1.0));\n  // vec4 samplerColor = texture2D(uTex, uv);\n  // gl_FragColor = vec4(samplerColor.rgb * r, 1.0);\n\n  // ===== color dest\n  vec4 destColor = texture2D(uTex, uv);\n  // vec4 R = texture2D(uTex, uv + vec2( 0.002 * sin(mouse.x * 10.0), 0.0));\n  // vec4 G = texture2D(uTex, uv + vec2( 0.00  * cos(mouse.x * 10.0), 0.0));\n  // vec4 B = texture2D(uTex, uv + vec2(-0.002 * sin(mouse.x * 10.0), 0.0));\n  vec4 R = texture2D(uTex, uv + vec2( 0.005 * sin(floor(mouse.x)), 0.0));\n  vec4 G = texture2D(uTex, uv + vec2( 0.00  * cos(floor(mouse.x)), 0.0));\n  vec4 B = texture2D(uTex, uv + vec2(-0.005 * sin(floor(mouse.x)), 0.0));\n  // gl_FragColor = vec4(vec3(R.r, G.g, B.b), 1.0);\n\n  gl_FragColor = texture2D(uTex, uv);\n}\n";

},{}],5:[function(require,module,exports){
module.exports = "varying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  gl_Position = vec4(position, 1.0);\n}\n";

},{}],6:[function(require,module,exports){
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
    var mainFrag__WIRE = require('./../_shader/main_wire.frag');
    var mainFrag__OBJ = require('./../_shader/main_obj.frag');
    var postVert = require('./../_shader/post.vert');
    var postFrag = require('./../_shader/post.frag');
    var Perlin = require('./../js/lib/perlin.js').Perlin;

    var renderer = void 0;
    var scene = void 0;
    var camera = void 0;

    var uniforms__WIRE = void 0;
    var uniforms__OBJ = void 0;

    var geometry__WIRE = void 0;
    var geometry__OBJ = void 0;

    var material__WIRE = void 0;
    var material__OBJ = void 0;

    var directional = void 0;
    var ambient = void 0;

    var wire = void 0;
    var obj = void 0;

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

      uniforms__WIRE.mouse.value.x = e.pageX;
      uniforms__WIRE.mouse.value.y = e.pageY;
      uniforms__OBJ.mouse.value.x = e.pageX;
      uniforms__OBJ.mouse.value.y = e.pageY;
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

      uniforms__WIRE.resolution.value.x = renderer.domElement.width;
      uniforms__WIRE.resolution.value.y = renderer.domElement.height;
      uniforms__OBJ.resolution.value.x = renderer.domElement.width;
      uniforms__OBJ.resolution.value.y = renderer.domElement.height;
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
      uniforms__WIRE.resolution.value.x = renderer.domElement.width;
      uniforms__WIRE.resolution.value.y = renderer.domElement.height;
      uniforms__OBJ.resolution.value.x = renderer.domElement.width;
      uniforms__OBJ.resolution.value.y = renderer.domElement.height;
      uniforms__POST.resolution.value.x = renderer.domElement.width;
      uniforms__POST.resolution.value.y = renderer.domElement.height;
    };

    // ==================================================
    // 　　RENDER
    // ==================================================

    var render = function render() {
      count++;

      // scene.rotation.y = -count * 0.001;

      uniforms__WIRE.time.value += 0.05;
      uniforms__OBJ.time.value += 0.05;
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
      z: 100.0,
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

    uniforms__WIRE = {
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

    uniforms__OBJ = {
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

    // geometry = new THREE.PlaneBufferGeometry(1024, 1024, 256, 256);
    geometry__WIRE = new THREE.PlaneBufferGeometry(2048, 2048, 128, 128);
    geometry__OBJ = new THREE.PlaneBufferGeometry(2048, 2048, 128, 128);

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

    // material__OBJ = new THREE.MeshPhongMaterial({
    //   color: 0xffffff,
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

    material__WIRE = new THREE.ShaderMaterial({
      uniforms: uniforms__WIRE,
      vertexShader: mainVert,
      fragmentShader: mainFrag__WIRE,
      side: THREE.FrontSide,
      wireframe: true
      // transparent: true,
      // depthWrite: true,
      // fog: true,
      // side: THREE.DoubleSide
    });

    material__OBJ = new THREE.ShaderMaterial({
      uniforms: uniforms__OBJ,
      vertexShader: mainVert,
      fragmentShader: mainFrag__OBJ
      // side: THREE.DoubleSide
      // wireframe: true,
      // transparent: true,
      // depthWrite: true,
      // fog: true,
    });

    // ==================================================
    // 　　LIGHT
    // ==================================================

    directional = new THREE.DirectionalLight(0xffffff);
    directional.position.set(0, 10, 0);
    // directional.shadowCameraVisible = true;
    // directional.castShadow = true;
    scene.add(directional);

    ambient = new THREE.AmbientLight(0xffffff, 0.2);
    // ambient.shadowCameraVisible = true;
    // ambient.castShadow = true;
    scene.add(ambient);

    // ==================================================
    // 　　MESH / GROUP
    // ==================================================

    wire = new THREE.Mesh(geometry__WIRE, material__WIRE);
    obj = new THREE.Mesh(geometry__OBJ, material__OBJ);

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

    // mesh.position.y = -300.0;
    // mesh.position.z = -500.0;
    // mesh.rotation.x = -Math.PI*0.25;
    wire.rotation.x = -Math.PI * 0.4;
    wire.position.y = -100.0;

    obj.rotation.x = -Math.PI * 0.5;
    obj.position.y = -104.0;

    // group = new THREE.Group();
    // group.add(mesh);

    scene.add(wire);
    // scene.add(obj);

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

},{"./../_shader/main.vert":1,"./../_shader/main_obj.frag":2,"./../_shader/main_wire.frag":3,"./../_shader/post.frag":4,"./../_shader/post.vert":5,"./../js/lib/perlin.js":7}],7:[function(require,module,exports){
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

},{}]},{},[6]);
