(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = "precision highp float;\n\nuniform vec2 resolution;\nuniform vec2 mouse;\nuniform float time;\n\nvoid main(){\n\n  // vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n  // vec3 color = vec3(sin(time * 2.0), 0.0, cos(time * 2.0));\n  vec3 color = 0.5 + 0.5 * cos(time + uv.xyx + vec3(0, 2, 4));\n\n  gl_FragColor = vec4(color, 1.0);\n  // gl_FragColor = vec4(vec3(1.0, 0.0, 1.0), 1.0);\n\n}\n";

},{}],2:[function(require,module,exports){
module.exports = "// varying vec2 vUv;\n\nvoid main() {\n  // vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";

},{}],3:[function(require,module,exports){
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
  //   init();
  //   // let renderer = new THREE.WebGLRenderer();
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
    // let init = () => {

    // ==================================================
    // 　　VARIABLES
    // ==================================================

    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;
    var targetDOM = document.getElementById('canvas');
    targetDOM.width *= devicePixelRatio;
    targetDOM.height *= devicePixelRatio;
    targetDOM.style.width = String(targetDOM.width / devicePixelRatio) + 'px';

    var mainVert = require('./../_shader/main.vert');
    var mainFrag = require('./../_shader/main.frag');
    // let postVert = require('./../_shader/post.vert');
    // let postFrag = require('./../_shader/post.frag');

    // let run = true;
    // window.addEventListener('keydown', function(event) {
    //   run = event.keyCode !== 27;
    // }, false);

    window.addEventListener('mousemove', function (e) {
      var x = event.clientX * 2.0 - winWidth;
      var y = event.clientY * 2.0 - winHeight;
      x /= winWidth;
      y /= winHeight;
      scene.position.x = -x * 0.1;
      scene.position.y = y * 0.1;

      uniforms.mouse.value.x = e.pageX;
      uniforms.mouse.value.y = e.pageY;
    }, false);

    // ==================================================
    // 　　INIT
    // ==================================================

    var init = function init() {
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    // ==================================================
    // 　　RESIZE
    // ==================================================

    window.addEventListener('resize', function () {
      winWidth = window.innerWidth;
      winHeight = window.innerHeight;
      renderer.setSize(winWidth, winHeight);
      camera.aspect = winWidth / winHeight;
      camera.updateProjectionMatrix();
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    }, false);

    // ==================================================
    // 　　SCROLL
    // ==================================================

    // let scrollWatch = function() {
    //   let scrollTop = $(window).scrollTop();
    //   scene.position.y = scrollTop * 0.02;
    //   window.requestAnimationFrame(scrollWatch);
    // }

    // ==================================================
    // 　　RENDER
    // ==================================================

    var render = function render() {
      count++;
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    // ==================================================
    // 　　CLASS
    // ==================================================

    var scene = void 0;
    var camera = void 0;
    var controls = void 0;
    var uniforms = void 0;
    var renderer = void 0;
    var geometry = void 0;
    var material = void 0;
    var directional = void 0;
    var ambient = void 0;
    var group = void 0;
    var mesh = void 0;

    // ==================================================
    // 　　PARAMETER
    // ==================================================

    var CAMERA_PARAMETER = {
      fovy: 60,
      aspect: winWidth / winHeight,
      near: 0.1,
      far: 1000.0,
      x: 0.0,
      y: 0.0,
      z: 5.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0)
    };

    var RENDERER_PARAMETER = {
      clearColor: 0xf5f5f5,
      width: winWidth,
      height: winHeight
    };

    var MATERIAL_PARAMETER = {
      color: 0xff0000
    };

    // ==================================================
    // 　　INITIALIZE
    // ==================================================

    scene = new THREE.Scene();

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

    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.clearColor));
    renderer.setSize(RENDERER_PARAMETER.width, RENDERER_PARAMETER.height);
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

    geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array([-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0]);

    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

    // ==================================================
    // 　　MATERIAL
    // ==================================================

    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: mainVert,
      fragmentShader: mainFrag
    });

    material.side = THREE.DoubleSide;

    // ==================================================
    // 　　LIGHT
    // ==================================================

    directional = new THREE.DirectionalLight(0xffffff);
    ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(directional);
    scene.add(ambient);

    // ==================================================
    // 　　MESH / GROUP
    // ==================================================

    mesh = new THREE.Line(geometry, material);
    scene.add(mesh);

    // ==================================================
    // 　　EVENT
    // ==================================================

    init();

    var count = 0;
    render();

    // }
  }, false);
})();

},{"./../_shader/main.frag":1,"./../_shader/main.vert":2}]},{},[3]);
