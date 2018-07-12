(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\nvarying vec4  vColor;\nvarying float fogFactor;\n// varying vec3 vPosition;\n\nvoid main(){\n\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n\t// ===== FOG\n  vec3 color = 0.5 + 0.5 * cos(time + uv.xyx + vec3(0, 2, 4));\n\tgl_FragColor = mix(vec4(color, 1.0), vColor, fogFactor);\n\n\t// ===== DEFAULT\n\t// gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}\n";

},{}],2:[function(require,module,exports){
module.exports = "// attribute vec3 position;\n// attribute vec4 color;\n// uniform float time;\n// varying vec4 vColor;\n\n// attribute vec3 position;\n// attribute vec3 normal;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\n// attribute vec3 u_position;\n\nvarying vec4  vColor;\nvarying float fogFactor;\n// varying vec3 vPosition;\n// varying vec3 vNormal;\n// varying vec3 vWorldPosition;\n\n//=========================\n//　　UTILS\n//=========================\n\n//=========================\n//　　MAIN\n//=========================\n\nvoid main() {\n\n  // float p = abs(rnd(vec2(normal.zz)) * sin(time * 0.2) * 0.8);\n\tvec3 uv = vec3(position);\n       uv.x += 3.0 * smoothstep(\n         sin(time * 0.5) + position.y * 0.8,\n         sin(time * 0.5) + position.y * 0.8,\n         position.y\n       );\n\n\t// ===== FOG\n\tconst float near = 0.1;\n\tconst float far  = 50.0;\n\tconst float linerDepth = 1.0 / (far - near);\n\tconst vec4 lightDirection = vec4(0.0, 10.0, 0.0, 1.0);\n\tconst vec4 color = vec4(0.0, 0.0, 0.0, 1.0);\n\tconst float fogStart = -10.0;\n\tconst float fogEnd = 10.0;\n\n\tvec3 invLight = normalize(viewMatrix * lightDirection).xyz;\n\tvec3 invEye = normalize(viewMatrix * vec4(cameraPosition, 0.0)).xyz;\n\tvec3 halfLE = normalize(invLight + invEye);\n\tfloat diffuse = clamp(dot(normal, invLight), 0.1, 1.0);\n\tfloat specular = pow(clamp(dot(normal, halfLE), 0.0, 1.0), 50.0);\n\tvec4 amb = color * color;\n\tvColor = amb * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0);\n\tvec3 pos = (modelMatrix * vec4(position, 1.0)).xyz;\n\tfloat linerPos = length(cameraPosition - pos) * linerDepth;\n\tfogFactor = clamp((fogEnd - linerPos) / (fogEnd - fogStart), 0.0, 1.0);\n\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);\n\n\t// vPosition = position;\n  // gl_PointSize = 1.0;\n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";

},{}],3:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\nuniform sampler2D uTex;\nvarying vec2 vUv;\n\n// normal rad\nfloat rnd(vec2 n){\n  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n}\n\nvoid main() {\n\n  // vec2 ratio = vec2(\n  //   min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),\n  //   min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)\n  // );\n\n  vec2 ratio = vec2(\n    min((resolution.x / resolution.y) / (resolution.x / resolution.y), 1.0),\n    min((resolution.y / resolution.x) / (resolution.y / resolution.x), 1.0)\n  );\n\n  vec2 uv = vec2(\n    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,\n    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5\n  );\n\n  // vec4 color = vec4(1.0, 0.0, 1.0, 1.0);\n  // gl_FragColor = texture2D(uTex, uv) * color;\n\n  // ===== nomal rnd\n  // float r = rnd(gl_FragCoord.st + mod(time, 1.0));\n  // vec4 samplerColor = texture2D(uTex, uv);\n  // gl_FragColor = vec4(samplerColor.rgb * r, 1.0);\n\n  // ===== color dest\n  vec4 destColor = texture2D(uTex, uv);\n  // vec4 R = texture2D(uTex, uv + vec2( 0.002 * sin(mouse.x * 10.0), 0.0));\n  // vec4 G = texture2D(uTex, uv + vec2( 0.00  * cos(mouse.x * 10.0), 0.0));\n  // vec4 B = texture2D(uTex, uv + vec2(-0.002 * sin(mouse.x * 10.0), 0.0));\n  vec4 R = texture2D(uTex, uv + vec2( 0.005 * sin(floor(mouse.x)), 0.0));\n  vec4 G = texture2D(uTex, uv + vec2( 0.00  * cos(floor(mouse.x)), 0.0));\n  vec4 B = texture2D(uTex, uv + vec2(-0.005 * sin(floor(mouse.x)), 0.0));\n  // gl_FragColor = vec4(vec3(R.r, G.g, B.b), 1.0);\n\n  gl_FragColor = texture2D(uTex, uv);\n}\n";

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
    var mesh = void 0;
    var directional = void 0;
    var ambient = void 0;

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

      // scene.rotation.y = count * 0.01;

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
    // 　　LOADER @@@
    // ==================================================

    // obj loader + material
    loader = new THREE.OBJLoader();
    loader.load('./bunny.obj', function (object) {
      object.traverse(function (object) {
        if (object instanceof THREE.Mesh) {
          // phong
          // object.material = new THREE.MeshPhongMaterial({
          //   color: 0xff0000,
          //   side: THREE.DoubleSide
          // });
          // shader
          console.log(object.geometry.attributes.normal);
          object.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: mainVert,
            fragmentShader: mainFrag,
            side: THREE.FrontSide,
            wireframe: true
          });
        }
        object.position.y = -0.5;
      });
      scene.add(object);
    }, function (xhr) {
      console.log(xhr.loaded / xhr.total * 100 + '% loaded');
    }, function (error) {
      console.log('An error happened');
    });

    // json loader(not work)
    // loader = new THREE.JSONLoader();
    // loader.load('../man.json', function(geometry, material) {
    //   geometry = geometry;
    //   material = new THREE.MeshFaceMaterial(material);
    //   mesh = new THREE.Mesh(geometry, material);
    //   scene.add(mesh);
    // }

    // ==================================================
    // 　　GEOMETRY
    // ==================================================

    // geometry = new THREE.BoxGeometry(1, 1, 1);

    // ==================================================
    // 　　MATERIAL
    // ==================================================

    // material = new THREE.MeshPhongMaterial({
    //   color: 0xff0000,
    //   side: THREE.DoubleSide
    // });

    // material = new THREE.ShaderMaterial({
    //   uniforms: uniforms,
    //   vertexShader: mainVert,
    //   fragmentShader: mainFrag,
    //   side: THREE.FrontSide,
    //   // wireframe: true,
    //   // transparent: true,
    //   // depthWrite: true,
    //   // fog: true,
    //   // side: THREE.DoubleSide
    // });

    // ==================================================
    // 　　LIGHT
    // ==================================================

    directional = new THREE.DirectionalLight(0xffffff);
    directional.position.set(0, 10, 0);
    scene.add(directional);

    ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);

    // ==================================================
    // 　　MESH / GROUP
    // ==================================================

    // mesh = new THREE.Mesh(geometry, material);
    // mesh.rotation.x =  Math.PI*0.1;
    // mesh.rotation.y = -Math.PI*0.1;

    // mesh.rotation.x = -Math.PI*0.5;
    // mesh.position.y = -100.0;

    // group = new THREE.Group();
    // group.add(mesh);

    // scene.add(mesh);

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
